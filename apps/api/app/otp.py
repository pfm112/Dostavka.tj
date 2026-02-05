import random
import time
import redis
from .settings import settings

r = redis.from_url(settings.REDIS_URL, decode_responses=True)

def _key(phone: str) -> str:
    return f"otp:{phone}"

def _cooldown_key(phone: str) -> str:
    return f"otp:cooldown:{phone}"

def request_otp(phone: str) -> dict:
    # resend cooldown
    if r.exists(_cooldown_key(phone)):
        ttl = r.ttl(_cooldown_key(phone))
        return {"ok": False, "error": "cooldown", "retry_in": max(ttl, 0)}

    code = f"{random.randint(1000, 9999)}"
    r.setex(_key(phone), settings.OTP_TTL_SECONDS, code)
    r.setex(_cooldown_key(phone), settings.OTP_RESEND_SECONDS, "1")

    # TODO: integrate SMS provider (for MVP we return code in response in dev mode)
    return {"ok": True, "dev_code": code, "ttl": settings.OTP_TTL_SECONDS}

def verify_otp(phone: str, code: str) -> bool:
    stored = r.get(_key(phone))
    if not stored:
        return False
    if stored != code:
        return False
    r.delete(_key(phone))
    return True
