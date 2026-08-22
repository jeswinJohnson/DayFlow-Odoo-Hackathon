from dotenv import load_dotenv
import os

from pydantic import BaseModel

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_ADMIN_KEY=os.getenv("SUPABASE_ADMIN_KEY")

class Settings(BaseModel):
    SUPABASE_URL:str
    SUPABASE_KEY:str
    SUPABASE_ADMIN_KEY:str
        

settings = Settings(
    SUPABASE_URL = SUPABASE_URL,
    SUPABASE_KEY = SUPABASE_KEY,
    SUPABASE_ADMIN_KEY = SUPABASE_ADMIN_KEY
)