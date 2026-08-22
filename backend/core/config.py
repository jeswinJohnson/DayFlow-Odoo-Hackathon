from dotenv import load_dotenv
import os

from pydantic import BaseModel

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

class Settings(BaseModel):
    SUPABASE_URL:str
    SUPABASE_KEY:str
        

settings = Settings(
    SUPABASE_URL = SUPABASE_URL,
    SUPABASE_KEY = SUPABASE_KEY,
)