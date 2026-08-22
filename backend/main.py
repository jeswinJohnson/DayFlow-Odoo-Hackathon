import uvicorn
import os
from fastapi import FastAPI
from endpoint import api
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings

app = FastAPI(
    title="DayFlow API V1",
    docs_url="/",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

app.include_router(api.api_router, prefix="/v1")

if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8001)), proxy_headers=True, forwarded_allow_ips='*')