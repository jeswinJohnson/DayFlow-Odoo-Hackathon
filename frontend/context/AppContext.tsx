"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AppContextType } from "@/types";
import { createClient } from "@/supabase/client";
import toast from "react-hot-toast";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);

  const [supabase] = useState(() => createClient());

  // FIX: FALLBACK
  const fetchUserProfile = async (userId: string, emailFallback?: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*, departments(name)")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Could not fetch profile from 'users' table, falling back to auth session info:", error.message);
        const fallbackUser: User = {
          id: userId,
          email: emailFallback || "",
          name: emailFallback ? emailFallback.split("@")[0] : "User",
        };
        setActiveUser(fallbackUser);
        return fallbackUser;
      }

      if (data?.departments?.name) {
        data.department_name = data.departments.name;
      }
      setActiveUser(data);
      return data;
    } catch (err) {
      console.error("Error loading user corporate profile:", err);
      const fallbackUser: User = {
        id: userId,
        email: emailFallback || "",
        name: emailFallback ? emailFallback.split("@")[0] : "User",
      };
      setActiveUser(fallbackUser);
      return fallbackUser;
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

  const logout = async () => {
    await supabase.auth.signOut();
    setActiveUser(null);
    setIsRecoveryMode(false);
  };

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


