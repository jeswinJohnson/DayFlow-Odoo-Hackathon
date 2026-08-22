from typing import Union
from pydantic import BaseModel


class DepartmentOut(BaseModel):
    id: Union[int, str]
    name: str
