from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .db import get_session, init_db
from .models import User, UserRole, Restaurant, Product, Order, OrderStatus
from .security import create_access_token, create_refresh_token
from .otp import request_otp, verify_otp
from .seed import seed

app = FastAPI(title="dostavka.tj API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()
    # seed data
    from .db import engine
    with Session(engine) as s:
        seed(s)

# ---- Auth (OTP) ----
@app.post("/auth/request-otp")
def auth_request_otp(payload: dict):
    phone = (payload.get("phone") or "").strip()
    if not phone:
        raise HTTPException(400, "phone_required")
    return request_otp(phone)

@app.post("/auth/verify-otp")
def auth_verify_otp(payload: dict, session: Session = Depends(get_session)):
    phone = (payload.get("phone") or "").strip()
    code = (payload.get("code") or "").strip()
    role = (payload.get("role") or "user").strip()

    if role not in {"user", "courier", "partner"}:
        raise HTTPException(400, "invalid_role")

    if not verify_otp(phone, code):
        raise HTTPException(400, "invalid_code")

    user = session.exec(select(User).where(User.phone == phone)).first()
    if not user:
        user = User(phone=phone, role=UserRole(role))
        session.add(user)
        session.commit()
        session.refresh(user)

    access = create_access_token(sub=str(user.id), role=user.role.value)
    refresh = create_refresh_token(sub=str(user.id), role=user.role.value)
    return {"access_token": access, "refresh_token": refresh, "user": {"id": user.id, "phone": user.phone, "role": user.role, "bonus_tjs": user.bonus_tjs}}

# ---- Catalog ----
@app.get("/restaurants")
def list_restaurants(session: Session = Depends(get_session)):
    items = session.exec(select(Restaurant).where(Restaurant.is_active == True)).all()
    return items

@app.get("/restaurants/{restaurant_id}")
def get_restaurant(restaurant_id: int, session: Session = Depends(get_session)):
    r = session.get(Restaurant, restaurant_id)
    if not r:
        raise HTTPException(404, "not_found")
    return r

@app.get("/restaurants/{restaurant_id}/products")
def list_products(restaurant_id: int, session: Session = Depends(get_session)):
    items = session.exec(select(Product).where(Product.restaurant_id == restaurant_id)).all()
    return items

@app.get("/products/{product_id}")
def get_product(product_id: int, session: Session = Depends(get_session)):
    p = session.get(Product, product_id)
    if not p:
        raise HTTPException(404, "not_found")
    return p

# ---- Orders (MVP) ----
@app.post("/orders")
def create_order(payload: dict, session: Session = Depends(get_session)):
    # MVP: unauthenticated for local demo; later require JWT
    user_phone = (payload.get("phone") or "").strip()
    restaurant_id = int(payload.get("restaurant_id") or 0)
    items = payload.get("items") or []
    if not user_phone or not restaurant_id or not items:
        raise HTTPException(400, "invalid_payload")

    user = session.exec(select(User).where(User.phone == user_phone)).first()
    if not user:
        user = User(phone=user_phone, role=UserRole.user)
        session.add(user); session.commit(); session.refresh(user)

    # server-side price calc
    subtotal = 0
    for it in items:
        pid = int(it.get("product_id") or 0)
        qty = int(it.get("qty") or 0)
        if qty <= 0:
            raise HTTPException(400, "invalid_qty")
        p = session.get(Product, pid)
        if not p or p.restaurant_id != restaurant_id:
            raise HTTPException(400, "invalid_product")
        subtotal += p.price_tjs * qty

    delivery = 15
    discount = 0
    total = subtotal + delivery - discount

    public_number = f"DST{(int(__import__('time').time()) % 10_000_000):07d}"
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
    session.add(order); session.commit(); session.refresh(order)
    return order

@app.get("/orders")
def list_orders(phone: str, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.phone == phone)).first()
    if not user:
        return []
    orders = session.exec(select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())).all()
    return orders

@app.get("/orders/{order_id}")
def get_order(order_id: int, session: Session = Depends(get_session)):
    o = session.get(Order, order_id)
    if not o:
        raise HTTPException(404, "not_found")
    return o
