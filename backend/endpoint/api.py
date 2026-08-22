from fastapi import APIRouter
from endpoint import profile, department, attendance

api_router = APIRouter()
api_router.include_router(profile.router, tags=["Profile"])
api_router.include_router(department.router, prefix="/department", tags=["Department"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["Attendance"])
