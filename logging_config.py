import logging
from fastapi import HTTPException
from models import LogEntry, LogCreate
from datetime import datetime
import httpx
import asyncio
from typing import List

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LogManager:
    def __init__(self):
        self.is_initialized = False
        self.pending_logs: List[LogCreate] = []

    async def initialize(self):
        self.is_initialized = True
        await self.flush_pending_logs()

    async def log_to_endpoint(self, level: str, message: str):
        log_data = LogCreate(
            timestamp=datetime.utcnow().isoformat(),
            level=level.upper(),
            message=message
        )
        if not self.is_initialized:
            self.pending_logs.append(log_data)
            logger.info(f"Pending log: [{log_data.level}] {log_data.message}")
        else:
            await self._send_log(log_data)

    async def flush_pending_logs(self):
        for log in self.pending_logs:
            await self._send_log(log)
        self.pending_logs.clear()

    async def _send_log(self, log_data: LogCreate):
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post("http://localhost:8000/api/log", json=log_data.model_dump())
                response.raise_for_status()
            except httpx.HTTPError as e:
                logger.error(f"Failed to send log to endpoint: {str(e)}")

log_manager = LogManager()

async def log_to_endpoint(level: str, message: str):
    await log_manager.log_to_endpoint(level, message)

def log_api_error(error: Exception, context: str):
    error_message = f"API Error in {context}: {str(error)}"
    logger.error(error_message)
    asyncio.create_task(log_to_endpoint("ERROR", error_message))

async def log_message(log_data: LogCreate, session):
    try:
        log_entry = LogEntry.create(
            timestamp=datetime.fromisoformat(log_data.timestamp),
            level=log_data.level,
            message=log_data.message
        )
        session.add(log_entry)
        await session.commit()
        logger.info(f"Log saved: {log_entry.level} - {log_entry.message}")
        return {"message": "Log saved successfully"}
    except Exception as e:
        error_message = f"Error saving log: {str(e)}"
        logger.error(error_message)
        raise HTTPException(status_code=500, detail=error_message)
