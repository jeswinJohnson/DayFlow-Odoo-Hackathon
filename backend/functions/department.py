from typing import List
from supabase import Client

from schema.auth import CurrentUser
from schema.department import DepartmentOut


def all_department(supabase: Client, currentUser: CurrentUser) -> List[DepartmentOut]:
    dept_res = (
        supabase.table("departments")
        .select("id, name")
        .execute()
    )

    departments: List[DepartmentOut] = []
    for dept in dept_res.data or []:
        departments.append(
            DepartmentOut(
                id=dept.get("id"),
                name=dept.get("name") or "",
            )
        )
    return departments
