from typing import List
from fastapi import APIRouter, Depends, status
from supabase import Client

from schema.profile import MyProfile, EditProfile, EmployeeDirectory, CreateUserRequest, CreateUserResponse
import functions.profile as pf
from schema.auth import CurrentUser
from core.dep import get_current_user, get_supabase_auth, get_supabase_admin

router = APIRouter()

@router.get("/my-profile", response_model=MyProfile)
def get_my_profile(current_user: CurrentUser = Depends(get_current_user), supabase: Client = Depends(get_supabase_auth)):
    return pf.get_my_profile(supabase, current_user)

@router.patch("/my-profile", response_model=MyProfile)
def edit_my_profile(
    profile_data: EditProfile,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth)
):
    return pf.edit_my_profile(supabase, current_user, profile_data)

@router.get("/directory", response_model=List[EmployeeDirectory])
def get_directory(
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth)
):
    return pf.get_company_directory(supabase, current_user)

@router.post("/create-user", response_model=CreateUserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: CreateUserRequest,
    current_user: CurrentUser = Depends(get_current_user),
    supabase: Client = Depends(get_supabase_auth),
    supabase_admin: Client = Depends(get_supabase_admin),
):
    return pf.create_user(supabase, current_user, user_data, supabase_admin)



