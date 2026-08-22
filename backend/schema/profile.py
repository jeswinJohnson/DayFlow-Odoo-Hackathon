

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

