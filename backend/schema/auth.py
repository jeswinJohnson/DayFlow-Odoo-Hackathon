from pydantic import BaseModel
from enum import Enum

class BundleType(str, Enum):
  ADMIN = "admin"
  EMP = "emp"

class CurrentUser(BaseModel):
    id: str
    role: BundleType