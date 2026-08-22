
from supabase import create_client, Client, ClientOptions
from schema.auth import CurrentUser
from core.config import settings
from fastapi import Depends
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from core.security import security, verify_token

def get_supabase_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    payload: dict = Depends(verify_token)
) -> Client:
    token = credentials.credentials
    client = create_client(
        settings.SUPABASE_URL, 
        settings.SUPABASE_KEY,
        options=ClientOptions(headers={"Authorization": f"Bearer {token}"})
    )
    return client

def get_current_user(
    payload: dict = Depends(verify_token),
    supabase: Client = Depends(get_supabase_auth)
) -> CurrentUser:
    user_id = payload.get("sub")
    print(user_id)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    try:
        response = supabase.table("users").select("id, role").eq("uid", user_id).single().execute()
        user_data = response.data    
        return CurrentUser(
            id=user_data.get("id"),
            role=user_data.get("role")
        )
    except Exception as e:
        print(f"Error fetching user from DB: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found in database or permission denied")


