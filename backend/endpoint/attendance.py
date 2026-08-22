from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from supabase import Client

from schema.auth import CurrentUser
from core.dep import get_current_user, get_supabase_auth
from schema.attendance import (
    AttendanceActionResponse,
    AttendanceStatusResponse,
    GetAllAttendanceResponse,
    UserDailyAttendanceResponse,
)
import functions.attendance as af

router = APIRouter()


@router.post("/check-in", response_model=AttendanceActionResponse)
def check_in(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
):
    return af.check_in(supabase, current_user)


@router.post("/check-out", response_model=AttendanceActionResponse)
def check_out(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
):
    return af.check_out(supabase, current_user)


@router.get("/get-all-attendance", response_model=GetAllAttendanceResponse)
@router.get("/all", response_model=GetAllAttendanceResponse)
def get_all_attendance(
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
):
    return af.get_all_attendance(supabase, current_user, date)


@router.get("/status", response_model=AttendanceStatusResponse)
def get_employee_attendance_status(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
):
    return af.get_employee_attendance_status(supabase, current_user)


@router.get("/daily", response_model=UserDailyAttendanceResponse)
@router.get("/user-daily", response_model=UserDailyAttendanceResponse)
def get_user_daily_attendance(
    date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format"),
    employee_id: Optional[str] = Query(None, description="Employee ID (defaults to current user)"),
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
):
    return af.get_user_daily_attendance(supabase, current_user, date, employee_id)
