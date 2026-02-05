from sqlmodel import Session, select
from .models import Restaurant, Product

def seed(session: Session):
    if session.exec(select(Restaurant)).first():
        return

    r1 = Restaurant(
        name="J Burger",
        cuisine="Европейская кухня",
        free_delivery=True,
        discount_text="-25% на всё",
        cashback_text="10% кэшбек",
        rating=4.3,
        eta_min=20,
        eta_max=25,
        min_order_tjs=50,
    )
    r2 = Restaurant(
        name="Истиклолол Пицца",
        cuisine="Итальянская кухня",
        discount_text="-25% на всё",
        cashback_text="10% кэшбек",
        rating=4.3,
        eta_min=20,
        eta_max=25,
        min_order_tjs=50,
    )
    session.add(r1)
    session.add(r2)
    session.commit()
    session.refresh(r1)
    session.refresh(r2)

    p1 = Product(restaurant_id=r1.id, name="Пицца ассорти", description="Мясо, сыр, томат, лаваш", price_tjs=42)
    p2 = Product(restaurant_id=r1.id, name="Бейти", description="Мясо, сыр, томат, лаваш", price_tjs=42)
    p3 = Product(restaurant_id=r2.id, name="Пицца 4 сыра", description="Сырная классика", price_tjs=45)
    session.add_all([p1, p2, p3])
    session.commit()
