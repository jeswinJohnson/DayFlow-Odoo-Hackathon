

import datetime
import secrets
from typing import List
from fastapi import HTTPException, status
from postgrest import APIResponse
from supabase import Client

from schema.auth import CurrentUser, BundleType
from schema.profile import MyProfile, EditProfile, EmployeeDirectory, CreateUserRequest, CreateUserResponse
from supabase_auth import AdminUserAttributes


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
            designation,
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
        designation=data.get("designation"),
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


def create_user(
    supabase: Client,
    currentUser: CurrentUser,
    user_data: CreateUserRequest,
    supabase_admin: Client = None,
) -> CreateUserResponse:
    role_val = currentUser.role

    if role_val != BundleType.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin users can create new users",
        )

    admin_client = supabase_admin if supabase_admin is not None else supabase

    # Get admin's company_id from users table
    admin_res = (
        supabase.table("users")
        .select("company_id")
        .eq("id", currentUser.id)
        .single()
        .execute()
    )
    admin_data = admin_res.data or {}
    company_id = admin_data.get("company_id")

    if not company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user is not associated with any company",
        )

    # Retrieve emp_index from companies table
    comp_res = (
        admin_client.table("companies")
        .select("emp_index")
        .eq("id", company_id)
        .single()
        .execute()
    )
    comp_data = comp_res.data or {}
    emp_index_raw = comp_data.get("emp_index")

    if emp_index_raw is None:
        emp_index = 1
    else:
        try:
            emp_index = int(emp_index_raw)
        except (ValueError, TypeError):
            emp_index = 1

    # Generate employee_id: first 2 letters of first_name and last_name + padded emp_index
    fn_clean = user_data.first_name.strip()
    ln_clean = user_data.last_name.strip()

    fn_code = (fn_clean[:2] if len(fn_clean) >= 2 else (fn_clean + "X")[:2]).upper()
    ln_code = (ln_clean[:2] if len(ln_clean) >= 2 else (ln_clean + "X")[:2]).upper()

    padded_index = f"{emp_index:04d}"
    employee_id = f"{fn_code}{ln_code}{padded_index}"

    # Increment emp_index in companies table using admin_client
    admin_client.table("companies").update({"emp_index": emp_index + 1}).eq("id", company_id).execute()

    # Generate random password
    random_password = "qwerty"

    # Create auth user in Supabase Auth using admin_client
    auth_user_uid = None
    try:
        auth_res = admin_client.auth.admin.create_user(
            AdminUserAttributes(
                email=user_data.email,
                password=random_password,
                email_confirm=True,
                user_metadata={
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name,
                },
            )
        )
        if auth_res and hasattr(auth_res, "user") and auth_res.user:
            auth_user_uid = auth_res.user.id
    except Exception as e:
        print(f"Error creating Supabase auth user with admin client: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create auth user: {str(e)}",
        )

    # Convert dept_id to int if integer-like
    dept_id_val = user_data.department_id
    if isinstance(dept_id_val, str) and dept_id_val.isdigit():
        dept_id_val = int(dept_id_val)

    # Insert into users table using admin_client
    user_payload = {
        "id": employee_id,
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "email": user_data.email,
        "phone": user_data.phone,
        "dept_id": dept_id_val,
        "company_id": company_id,
        "role": "employee",
        "uid": str(auth_user_uid) if auth_user_uid else None,
    }

    insert_res = admin_client.table("users").insert(user_payload).execute()
    inserted_records = insert_res.data or []
    inserted_user = inserted_records[0] if inserted_records else {}

    return CreateUserResponse(
        id=str(inserted_user.get("id") or employee_id),
        employee_id=employee_id,
        uid=str(auth_user_uid) if auth_user_uid else None,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        password=random_password,
        phone=user_data.phone,
        department_id=user_data.department_id,
        company_id=company_id,
        role="employee",
        message=f"User created successfully. Generated Employee ID: {employee_id}",
    )





