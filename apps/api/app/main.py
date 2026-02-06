import os
import time
from typing import Any

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .db import get_session, init_db, engine
from .models import User, UserRole, Restaurant, Product, Order, OrderStatus
from .security import create_access_token, create_refresh_token
from .otp import request_otp, verify_otp
from .seed import seed


app = FastAPI(title="dostavka.tj API", version="0.1.0")

# -------------------------
# CORS
# -------------------------
# Example CORS_ORIGINS:
# http://localhost:3000,https://dostavka-tj.vercel.app,https://dostavka.tj
cors_origins_raw = os.environ.get("CORS_ORIGINS", "").strip()
cors_origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]

if cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# -------------------------
# Startup
# -------------------------
@app.on_event("startup")
def on_startup():
    init_db()

    # Safer: seed only when explicitly enabled
    if os.environ.get("SEED_ON_STARTUP", "0") == "1":
        with Session(engine) as s:
            seed(s)


# -------------------------
# Helpers
# -------------------------
def _get_payload_str(payload: dict, key: str) -> str:
    return (payload.get(key) or "").strip()


def _get_payload_int(payload: dict, key: str, default: int = 0) -> int:
    try:
        return int(payload.get(key) or default)
    except Exception:
        return default


# -------------------------
# Auth (OTP)
# -------------------------
@app.post("/auth/request-otp")
def auth_request_otp(payload: dict[str, Any]):
    phone = _get_payload_str(payload, "phone")
    if not phone:
        raise HTTPException(status_code=400, detail="phone_required")
    return request_otp(phone)


@app.post("/auth/verify-otp")
def auth_verify_otp(payload: dict[str, Any], session: Session = Depends(get_session)):
    phone = _get_payload_str(payload, "phone")

    # Standard field: "otp"
    # Backward compat: accept "code" too
    otp = _get_payload_str(payload, "otp") or _get_payload_str(payload, "code")

    role = (_get_payload_str(payload, "role") or "user").lower()

    if not phone:
        raise HTTPException(status_code=400, detail="phone_required")
    if not otp:
        raise HTTPException(status_code=400, detail="otp_required")

    if role not in {"user", "courier", "partner"}:
        raise HTTPException(status_code=400, detail="invalid_role")

    if not verify_otp(phone, otp):
        raise HTTPException(status_code=400, detail="invalid_otp")

    user = session.exec(select(User).where(User.phone == phone)).first()
    if not user:
        user = User(phone=phone, role=UserRole(role))
        session.add(user)
        session.commit()
        session.refresh(user)

    access = create_access_token(sub=str(user.id), role=user.role.value)
    refresh = create_refresh_token(sub=str(user.id), role=user.role.value)

    return {
        "access_token": access,
        "refresh_token": refresh,
        "user": {
            "id": user.id,
            "phone": user.phone,
            "role": user.role.value,
            "bonus_tjs": user.bonus_tjs,
        },
    }


# -------------------------
# Catalog
# -------------------------
@app.get("/restaurants")
def list_restaurants(session: Session = Depends(get_session)):
    items = session.exec(select(Restaurant).where(Restaurant.is_active == True)).all()
    return items


@app.get("/restaurants/{restaurant_id}")
def get_restaurant(restaurant_id: int, session: Session = Depends(get_session)):
    r = session.get(Restaurant, restaurant_id)
    if not r:
        raise HTTPException(status_code=404, detail="not_found")
    return r


@app.get("/restaurants/{restaurant_id}/products")
def list_products(restaurant_id: int, session: Session = Depends(get_session)):
    items = session.exec(select(Product).where(Product.restaurant_id == restaurant_id)).all()
    return items


@app.get("/products/{product_id}")
def get_product(product_id: int, session: Session = Depends(get_session)):
    p = session.get(Product, product_id)
    if not p:
        raise HTTPException(status_code=404, detail="not_found")
    return p


# -------------------------
# Orders (MVP)
# -------------------------
@app.post("/orders")
def create_order(payload: dict[str, Any], session: Session = Depends(get_session)):
    # MVP: unauthenticated demo (later require JWT)
    user_phone = _get_payload_str(payload, "phone")
    restaurant_id = _get_payload_int(payload, "restaurant_id", 0)
    items = payload.get("items") or []

    if not user_phone or restaurant_id <= 0 or not isinstance(items, list) or len(items) == 0:
        raise HTTPException(status_code=400, detail="invalid_payload")

    user = session.exec(select(User).where(User.phone == user_phone)).first()
    if not user:
        user = User(phone=user_phone, role=UserRole.user)
        session.add(user)
        session.commit()
        session.refresh(user)

    subtotal = 0
    for it in items:
        pid = int((it or {}).get("product_id") or 0)
        qty = int((it or {}).get("qty") or 0)
        if pid <= 0 or qty <= 0:
            raise HTTPException(status_code=400, detail="invalid_item")

        p = session.get(Product, pid)
        if not p or p.restaurant_id != restaurant_id:
            raise HTTPException(status_code=400, detail="invalid_product")

        subtotal += int(p.price_tjs) * qty

    delivery = 15
    discount = 0
    total = subtotal + delivery - discount

    public_number = f"DST{(int(time.time()) % 10_000_000):07d}"

    order = Order(
        public_number=public_number,
        user_id=user.id,
        restaurant_id=restaurant_id,
        status=OrderStatus.accepted,
        subtotal_tjs=subtotal,
        delivery_tjs=delivery,
        discount_tjs=discount,
        total_tjs=total,
    )
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@app.get("/orders")
def list_orders(phone: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.phone == phone)).first()
    if not user:
        return []
    orders = session.exec(
        select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())
    ).all()
    return orders


@app.get("/orders/{order_id}")
def get_order(order_id: int, session: Session = Depends(get_session)):
    o = session.get(Order, order_id)
    if not o:
        raise HTTPException(status_code=404, detail="not_found")
    return o
