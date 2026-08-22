import datetime
from typing import List, Optional, Any
from fastapi import HTTPException, status
from supabase import Client

from schema.auth import CurrentUser, BundleType
from schema.attendance import (
    AttendanceActionResponse,
    AttendanceStatusResponse,
    GetAllAttendanceResponse,
    UserDailyAttendanceResponse,
)


def _call_rpc_with_id(supabase: Client, rpc_name: str, params: dict) -> Any:
    """Helper to execute RPC call with fallback parameter naming if primary fails."""
    try:
        res = supabase.rpc(rpc_name, params).execute()
        return res.data
    except Exception as e:
        err_msg = str(e)
        print(f"RPC {rpc_name} with params {params} error: {err_msg}")
        # Try alternate parameter key names if 'id' was passed
        if "id" in params and (
            "Could not find" in err_msg
            or "structure" in err_msg
            or "parameter" in err_msg
            or "function" in err_msg
            or "argument" in err_msg
        ):
            for alt_key in ["user_id", "p_id", "emp_id"]:
                alt_params = {k if k != "id" else alt_key: v for k, v in params.items()}
                try:
                    res = supabase.rpc(rpc_name, alt_params).execute()
                    return res.data
                except Exception:
                    pass
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"RPC '{rpc_name}' execution failed: {err_msg}",
        )


def check_in(supabase: Client, currentUser: CurrentUser) -> AttendanceActionResponse:
    """
    1. check-in: no input needed for the user, user id based on that a rpc called check_in_user which takes in the id.
    """
    user_id = currentUser.id
    result = _call_rpc_with_id(supabase, "check_in_user", {"p_user_id": user_id})
    return AttendanceActionResponse(
        message="User checked in successfully",
        data=result,
    )


def check_out(supabase: Client, currentUser: CurrentUser) -> AttendanceActionResponse:
    """
    2. check-out: no input needed for the user, user id based on that a rpc called check_out_user which takes in the id.
    """
    user_id = currentUser.id
    result = _call_rpc_with_id(supabase, "check_out_user", {"p_user_id": user_id})
    return AttendanceActionResponse(
        message="User checked out successfully",
        data=result,
    )


def get_employee_attendance_status(
    supabase: Client, currentUser: CurrentUser
) -> AttendanceStatusResponse:
    result = _call_rpc_with_id(supabase, "get_employee_attendance_status", {"p_user_id": currentUser.id})
    status_text = str(result) if result is not None else "absent"
    return AttendanceStatusResponse(
        employee_id=currentUser.id,
        status=status_text,
    )

def get_all_attendance(
    supabase: Client, currentUser: CurrentUser, target_date: Optional[str] = None
) -> GetAllAttendanceResponse:
    """
    3. for admins only, a function called get_all_attendance this will get all the attendance of the company of all the employees for that particular date.
    """
    if currentUser.role != BundleType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can view company attendance records",
        )

    if not target_date:
        target_date = datetime.date.today().isoformat()

    # Retrieve admin's company_id
    admin_res = (
        supabase.table("users")
        .select("company_id")
        .eq("id", currentUser.id)
        .single()
        .execute()
    )
    admin_data = admin_res.data or {}
    company_id = admin_data.get("company_id")

    # Try calling get_all_attendance RPC if available
    try:
        rpc_res = supabase.rpc("get_all_users_attendance", {"p_date": target_date}).execute()
        if rpc_res.data is not None:
            print(rpc_res.data)
            return GetAllAttendanceResponse(date=target_date, records=rpc_res.data)
    except Exception as e:
        print(f"Notice: get_all_attendance RPC call did not return directly, falling back to table query: {e}")

def get_user_daily_attendance(
    supabase: Client,
    currentUser: CurrentUser,
    target_date: Optional[str] = None,
) -> UserDailyAttendanceResponse:
    target_id = currentUser.id
    if not target_date:
        target_date = datetime.date.today().isoformat()

    result = _call_rpc_with_id(
        supabase,
        "get_user_daily_attendance",
        {"p_user_id": target_id, "p_date": target_date},
    )
    return result
