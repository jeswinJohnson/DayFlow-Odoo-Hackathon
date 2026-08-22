from typing import List
from fastapi import APIRouter, Depends
from supabase import Client

from schema.department import DepartmentOut
import functions.department as dept_fn
from schema.auth import CurrentUser
from core.dep import get_current_user, get_supabase_auth

router = APIRouter()


@router.get("/all", response_model=List[DepartmentOut])
def get_all_departments(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
):
    return dept_fn.all_department(supabase, current_user)
