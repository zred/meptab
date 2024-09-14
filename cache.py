from aioredis import Redis
from typing import Optional

redis: Optional[Redis] = None

async def init_redis():
    global redis
    redis = await Redis.from_url("redis://localhost")

async def get_cache(key: str) -> Optional[str]:
    return await redis.get(key)

async def set_cache(key: str, value: str, expire: int = 3600):
    await redis.set(key, value, ex=expire)

async def delete_cache(key: str):
    await redis.delete(key)

