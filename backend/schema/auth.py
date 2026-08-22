from pydantic import BaseModel
from enum import Enum

class BundleType(str, Enum):
    ADMIN = "admin"
    EMP = "employee"
    EMP_SHORT = "emp"

class CurrentUser(BaseModel):
    id: str
    role: BundleType