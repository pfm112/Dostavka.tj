from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    REDIS_URL: str
    JWT_SECRET: str
    JWT_ISSUER: str = "dostavka.tj"

    ACCESS_TOKEN_MINUTES: int = 30
    REFRESH_TOKEN_DAYS: int = 14

    OTP_TTL_SECONDS: int = 180
    OTP_RESEND_SECONDS: int = 45

settings = Settings()
