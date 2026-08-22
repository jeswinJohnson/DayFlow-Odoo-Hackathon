from fastapi import APIRouter, Depends
from supabase import Client

from schema.profile import MyProfile, EditProfile
import functions.profile as pf
from schema.auth import CurrentUser
from core.dep import get_current_user, get_supabase_auth

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
