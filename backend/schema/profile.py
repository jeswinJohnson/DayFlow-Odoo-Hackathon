

import datetime
from typing import List, Optional

from pydantic import BaseModel

class MyProfile(BaseModel):
    f_name: str
    l_name: str
    email: str
    comp_name: str
    dept_name: Optional[str]
    location: Optional[str]
    bio: Optional[str]
    p_email: Optional[str]
    dob: Optional[datetime.datetime]
    nationality: Optional[str]
    manager_name: Optional[str]
    skills: List[str]
    certification: List[str]
    gender: Optional[str]
    marital_status: Optional[str]
    doj: Optional[datetime.datetime]
    uan_no: Optional[str]
    pan_no: Optional[str]
    ifsc_code: Optional[str]
    bank_name: Optional[str]
    acc_number: Optional[str]


class EditProfile(BaseModel):
    location: Optional[str] = None
    bio: Optional[str] = None
    p_email: Optional[str] = None
    dob: Optional[datetime.datetime] = None
    nationality: Optional[str] = None
    skills: Optional[List[str]] = None
    certification: Optional[List[str]] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    doj: Optional[datetime.datetime] = None
    uan_no: Optional[str] = None
    pan_no: Optional[str] = None
    ifsc_code: Optional[str] = None
    bank_name: Optional[str] = None
    acc_number: Optional[str] = None


