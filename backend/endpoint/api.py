from fastapi import APIRouter
from endpoint import profile

api_router = APIRouter()
api_router.include_router(profile.router, tags=["Profile"])