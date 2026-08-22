import datetime
from typing import List, Optional, Any, Union
from pydantic import BaseModel, Field

class AttendanceActionResponse(BaseModel):
    message: str
    data: Optional[Any] = None

class AttendanceStatusResponse(BaseModel):
    employee_id: str
    status: Optional[str] = None

class AttendanceRecord(BaseModel):
    id: Optional[Union[str, int]] = None
    user_id: Optional[str] = None
    employee_name: Optional[str] = None
    date: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    work_hours: Optional[str] = None
    extra_hours: Optional[str] = None
    status: Optional[str] = None
    department: Optional[str] = None

class GetAllAttendanceResponse(BaseModel):
    date: str
    records: List[Any]

class UserDailyAttendanceResponse(BaseModel):
    employee_id: str
    date: str
    attendance: Optional[Any] = None
