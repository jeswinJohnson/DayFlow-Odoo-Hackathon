"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import {
  User,
  AppContextType,
  MyProfile,
  EditProfile,
  EmployeeDirectory,
  DepartmentOut,
  CreateUserRequest,
  CreateUserResponse,
  AttendanceActionResponse,
  AttendanceStatusResponse,
  GetAllAttendanceResponse,
  UserDailyAttendanceResponse,
} from "@/types";
import { createClient } from "@/supabase/client";
import toast from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
  const [myProfile, setMyProfile] = useState<MyProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [directory, setDirectory] = useState<EmployeeDirectory[] | null>(null);
  const [directoryLoading, setDirectoryLoading] = useState<boolean>(false);
  const [departments, setDepartments] = useState<DepartmentOut[] | null>(null);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(false);

  // Attendance State
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);

  const [supabase] = useState(() => createClient());

  const logout = async () => {
    await supabase.auth.signOut();
    setActiveUser(null);
    setIsRecoveryMode(false);
    setIsCheckedIn(false);
    setCheckInTime(null);
    setAttendanceStatus(null);
  };

  const fetchUserProfile = async (userId: string, emailFallback?: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, role")
        .eq("email", emailFallback)
        .single();

      if (error) {
        toast.error("Could Not Find User!");
        logout()
        return null;
      }

      setActiveUser(data);
      return data;
    } catch (err) {
      toast.error("Could Not Find User!");
      logout()
      return null;
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window.location.hash.includes("type=recovery") ||
        window.location.href.includes("type=recovery"))
    ) {
      setIsRecoveryMode(true);
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (!isMounted) return;
        if (session?.user?.id) {
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          setActiveUser(null);
        }
        setAuthLoading(false);
      })
      .catch((err) => {
        console.error("Session fetch error:", err);
        if (isMounted) {
          setActiveUser(null);
          setAuthLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      if (event === "PASSWORD_RECOVERY") {
        setIsRecoveryMode(true);
      }
      if (session?.user?.id) {
        await fetchUserProfile(session.user.id, session.user.email);
      } else {
        setActiveUser(null);
      }
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const login = async (identifier: string, password: string) => {
    let emailToUse : string | null = identifier.trim();

    if (!emailToUse.includes("@")) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*").eq("id", emailToUse)
          .maybeSingle();
        if (error) {
          toast.error("Invalid User ID, Please Try With Email");
          console.warn("UID lookup notice:", error.message);
          return;
        }
        if (data?.email) {
          emailToUse = data.email;
        }else{
          toast.error("Invalid User ID, Please Try With Email");
          return;
        }
      } catch (e) {
        console.warn("UID lookup error, proceeding with input as email:", e);
        toast.error("Uh-Oh, An error occured. Please try again later!");
        return;
      }
    }

    if(!emailToUse){
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) {
      console.warn("SignIn Error:", error);
      toast.error("Invalid Credentials, Please Check Cred");
      return;
    }

    if (data.user?.id) {
      await fetchUserProfile(data.user.id, data.user.email);
    }

    return data;
  };

  const resetPassword = async (identifier: string) => {
    let emailToUse = identifier.trim();

    if (!emailToUse.includes("@")) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*").eq("id", emailToUse)
          .maybeSingle();
        if (error) {
          toast.error("Invalid User ID, Please Try With Email");
          console.warn("UID lookup notice:", error.message);
          return;
        }
        if (data?.email) {
          emailToUse = data.email;
        }else{
          toast.error("Invalid User ID, Please Try With Email");
          return;
        }
      } catch (e) {
        console.warn("UID lookup error, proceeding with input as email:", e);
        toast.error("Uh-Oh, An error occured. Please try again later!");
        return;
      }
    }

    if(!emailToUse){
      return;
    }

    const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw error;
    }
    setIsRecoveryMode(false);
  };


  // General Helper Funcations
  const getDataFromServer = async (endpoints: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No active session found");
      }

      console.log(session.access_token)

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND;
      const response = await fetch(`${backendUrl}/v1/${endpoints}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        try{
          const responseData = await response.json();
          toast.error(`${responseData.detail}`);
        }catch(e){
          toast.error(`Uh oh! Something went wrong while fetching data.`);
        }
        return null
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("fetch error:", error);
      toast.error("Uh oh! Something went wrong while fetching data.");
    }
  }

  const postDataToServer = async (endpoints: string, body: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No active session found");
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND;
      const response = await fetch(`${backendUrl}/v1/${endpoints}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.log(errorBody);
        if (errorBody.detail) {
          throw new Error(errorBody.detail);
        } else {
          throw new Error("Uh oh! Something went wrong while updating data.");
        }
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      const err = error as any;
      console.error("fetch error:", err.message);
      toast.error(err.message);
      throw error;
    }
  };

  const patchDataToServer = async (endpoints: string, body: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No active session found");
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND;
      const response = await fetch(`${backendUrl}/v1/${endpoints}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.log(errorBody);
        if (errorBody.detail) {
          if (Array.isArray(errorBody.detail)) {
            const msgs = errorBody.detail.map((e: any) => e.msg || e.detail).join(", ");
            throw new Error(msgs);
          }
          throw new Error(errorBody.detail);
        } else {
          throw new Error("Uh oh! Something went wrong while updating data.");
        }
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      const err = error as any;
      console.error("patch error:", err.message);
      toast.error(err.message || "Uh oh! Something went wrong while updating data.");
      throw error;
    }
  };

  const fetchMyProfile = async (): Promise<MyProfile | null> => {
    setProfileLoading(true);
    try {
      const data = await getDataFromServer("my-profile");
      if (data) {
        setMyProfile(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching my profile:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const updateMyProfile = async (editData: EditProfile): Promise<MyProfile | null> => {
    setProfileLoading(true);
    try {
      const data = await patchDataToServer("my-profile", editData);
      if (data) {
        setMyProfile(data);
        toast.success("Profile updated successfully!");
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchDirectory = async (): Promise<EmployeeDirectory[] | null> => {
    setDirectoryLoading(true);
    try {
      const data = await getDataFromServer("directory");
      if (data) {
        setDirectory(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching employee directory:", error);
      return null;
    } finally {
      setDirectoryLoading(false);
    }
  };

  const fetchDepartments = async (): Promise<DepartmentOut[] | null> => {
    setDepartmentsLoading(true);
    try {
      const data = await getDataFromServer("department/all");
      if (data) {
        setDepartments(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching departments:", error);
      return null;
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const fetchAttendanceStatus = async (): Promise<AttendanceStatusResponse | null> => {
    try {
      const data: AttendanceStatusResponse = await getDataFromServer("attendance/status");
      if (data) {
        setAttendanceStatus(data.status || null);
        const statusLower = (data.status || "").toLowerCase();
        const isPresent =
          statusLower === "present" ||
          statusLower === "checked_in" ||
          statusLower === "in_progress" ||
          statusLower === "true";
        setIsCheckedIn(isPresent);
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching attendance status:", error);
      return null;
    }
  };

  const fetchUserDailyAttendance = async (
    date?: string,
    employeeId?: string
  ): Promise<UserDailyAttendanceResponse | null> => {
    try {
      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (employeeId) params.append("employee_id", employeeId);
      const query = params.toString() ? `?${params.toString()}` : "";

      const data: UserDailyAttendanceResponse = await getDataFromServer(`attendance/daily${query}`);
      if (data && data.attendance) {
        const att = data.attendance;
        if (att.check_in && (!att.check_out || att.check_out === "Active" || att.check_out === "—")) {
          setIsCheckedIn(true);
          setCheckInTime(att.check_in);
        } else if (att.check_in && att.check_out) {
          setIsCheckedIn(false);
          setCheckInTime(null);
        }
      }
      return data || null;
    } catch (error) {
      console.error("Error fetching daily attendance:", error);
      return null;
    }
  };

  const checkIn = async (): Promise<AttendanceActionResponse | null> => {
    setAttendanceLoading(true);
    try {
      const data = await postDataToServer("attendance/check-in", {});
      if (data) {
        const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setIsCheckedIn(true);
        setCheckInTime(nowTime);
        setAttendanceStatus("present");
        toast.success(data.message || `Checked IN at ${nowTime}!`);
        await fetchAttendanceStatus();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error checking in:", error);
      return null;
    } finally {
      setAttendanceLoading(false);
    }
  };

  const checkOut = async (): Promise<AttendanceActionResponse | null> => {
    setAttendanceLoading(true);
    try {
      const data = await postDataToServer("attendance/check-out", {});
      if (data) {
        setIsCheckedIn(false);
        setCheckInTime(null);
        setAttendanceStatus("absent");
        toast.success(data.message || "Checked OUT successfully.");
        await fetchAttendanceStatus();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error checking out:", error);
      return null;
    } finally {
      setAttendanceLoading(false);
    }
  };

  const toggleCheckIn = async (): Promise<void> => {
    if (isCheckedIn) {
      await checkOut();
    } else {
      await checkIn();
    }
  };

  const fetchAllAttendance = async (date?: string): Promise<GetAllAttendanceResponse | null> => {
    try {
      const query = date ? `?date=${encodeURIComponent(date)}` : "";
      const data: GetAllAttendanceResponse = await getDataFromServer(`attendance/all${query}`);
      return data || null;
    } catch (error) {
      console.error("Error fetching all attendance:", error);
      return null;
    }
  };

  const createUser = async (userData: CreateUserRequest): Promise<CreateUserResponse | null> => {
    try {
      const data = await postDataToServer("create-user", userData);
      if (data) {
        toast.success(data.message || "User created successfully!");
        await fetchDirectory();
        return data;
      }
      return null;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  };

  // Sync attendance on user login
  useEffect(() => {
    if (activeUser?.id) {
      fetchAttendanceStatus();
      fetchUserDailyAttendance();
    }
  }, [activeUser?.id]);

  return (
    <AppContext.Provider
      value={{
        activeUser,
        authLoading,
        setActiveUser,
        login,
        logout,
        isRecoveryMode,
        setIsRecoveryMode,
        resetPassword,
        updatePassword,
        myProfile,
        profileLoading,
        fetchMyProfile,
        updateMyProfile,
        directory,
        directoryLoading,
        fetchDirectory,
        departments,
        departmentsLoading,
        fetchDepartments,
        createUser,
        isCheckedIn,
        checkInTime,
        attendanceStatus,
        attendanceLoading,
        checkIn,
        checkOut,
        toggleCheckIn,
        fetchAttendanceStatus,
        fetchUserDailyAttendance,
        fetchAllAttendance,
        getDataFromServer,
        postDataToServer,
        patchDataToServer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};


