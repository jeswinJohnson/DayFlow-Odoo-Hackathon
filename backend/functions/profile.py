

import datetime
from typing import List
from fastapi import HTTPException
from postgrest import APIResponse
from supabase import Client

from schema.auth import CurrentUser
from schema.profile import MyProfile, EditProfile, EmployeeDirectory


def get_my_profile(supabase: Client, currentUser:CurrentUser) -> MyProfile:
    response = (
        supabase.table("users")
        .select(
            """
            first_name,
            last_name,
            email,
            personal_email,
            location,
            bio,
            skills,
            certification,
            dob,
            nationality,
            gender,
            marital_status,
            doj,
            uan_no,
            pan_no,
            ifsc_code,
            bank_name,
            acc_number,
            companies ( name ),
            departments ( name ),
            manager:manager_id ( first_name, last_name )
        """
        )
        .eq("id", currentUser.id)
        .single()
        .execute()
    )

    data = response.data
    if not data:
        raise HTTPException(status_code=422 , detail="User Not Found!") 

    comp_data = data.get("companies")
    comp_name = comp_data.get("name") if isinstance(comp_data, dict) else ""

    dept_data = data.get("departments")
    dept_name = dept_data.get("name") if isinstance(dept_data, dict) else None

    manager_data = data.get("manager")
    manager_name = None
    if isinstance(manager_data, dict) and manager_data.get("first_name"):
        manager_name = f"{manager_data.get('first_name', '')} {manager_data.get('last_name', '')}".strip()

    return MyProfile(
        f_name=data.get("first_name"),
        l_name=data.get("last_name"),
        email=data.get("email"),
        comp_name=comp_name,
        dept_name=dept_name,
        location=data.get("location"),
        bio=data.get("bio"),
        p_email=data.get("personal_email"),
        dob=data.get("dob"),
        nationality=data.get("nationality"),
        manager_name=manager_name,
        skills=data.get("skills") or [],
        certification=data.get("certification") or [],
        gender=data.get("gender"),
        marital_status=data.get("marital_status"),
        doj=data.get("doj"),
        uan_no=data.get("uan_no"),
        pan_no=data.get("pan_no"),
        ifsc_code=data.get("ifsc_code"),
        bank_name=data.get("bank_name"),
        acc_number=data.get("acc_number"),
    )


def edit_my_profile(supabase: Client, currentUser: CurrentUser, profile_data: EditProfile) -> MyProfile:
    raw_dict = profile_data.model_dump(exclude_unset=True)
    if raw_dict:
        update_payload = {}
        for key, value in raw_dict.items():
            db_key = "personal_email" if key == "p_email" else key
            if isinstance(value, (datetime.datetime, datetime.date)):
                update_payload[db_key] = value.isoformat()
            else:
                update_payload[db_key] = value

        supabase.table("users").update(update_payload).eq("id", currentUser.id).execute()

    return get_my_profile(supabase, currentUser)


def get_company_directory(supabase: Client, currentUser: CurrentUser) -> List[EmployeeDirectory]:
    user_res = (
        supabase.table("users")
        .select("company_id")
        .eq("id", currentUser.id)
        .single()
        .execute()
    )
    user_data = user_res.data or {}
    company_id = user_data.get("company_id")

    query = supabase.table("users").select(
        """
        id,
        first_name,
        last_name,
        email,
        phone,
        role,
        bio,
        location,
        company_id,
        departments ( name )
    """
    )

    if company_id is not None:
        query = query.eq("company_id", company_id)

    res = query.execute()

    directory: List[EmployeeDirectory] = []
    for emp in res.data or []:
        f_name = emp.get("first_name") or ""
        l_name = emp.get("last_name") or ""
        full_name = f"{f_name} {l_name}".strip() or ""

        dept_data = emp.get("departments")
        dept_name = dept_data.get("name") if isinstance(dept_data, dict) else ""

        designation = emp.get("designation") or ""

        directory.append(
            EmployeeDirectory(
                id=str(emp.get("id")) if emp.get("id") else None,
                name=full_name,
                f_name=f_name,
                l_name=l_name,
                designation=designation,
                dept=dept_name,
                email=emp.get("email") or "",
                phone=emp.get("phone"),
                bio=emp.get("bio"),
                location=emp.get("location"),
                
            )
        )

    return directory

