from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field

class UserRole(str, Enum):
    user = "user"
    courier = "courier"
    partner = "partner"
    admin = "admin"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    phone: str = Field(index=True, unique=True)
    role: UserRole = Field(default=UserRole.user)
    bonus_tjs: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Restaurant(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    cuisine: str
    rating: float = 4.3
    eta_min: int = 20
    eta_max: int = 25
    min_order_tjs: int = 50
    free_delivery: bool = False
    discount_text: Optional[str] = None
    cashback_text: Optional[str] = None
    is_active: bool = True

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    restaurant_id: int = Field(index=True, foreign_key="restaurant.id")
    name: str
    description: str = ""
    price_tjs: int = 0
    image_url: str = ""
    is_available: bool = True

class OrderStatus(str, Enum):
    accepted = "accepted"
    cooking = "cooking"
    on_the_way = "on_the_way"
    delivered = "delivered"
    cancelled = "cancelled"

class Order(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    public_number: str = Field(index=True, unique=True)
    user_id: int = Field(index=True, foreign_key="user.id")
    restaurant_id: int = Field(index=True, foreign_key="restaurant.id")
    status: OrderStatus = Field(default=OrderStatus.accepted)

    subtotal_tjs: int = 0
    delivery_tjs: int = 15
    discount_tjs: int = 0
    total_tjs: int = 0

    created_at: datetime = Field(default_factory=datetime.utcnow)
