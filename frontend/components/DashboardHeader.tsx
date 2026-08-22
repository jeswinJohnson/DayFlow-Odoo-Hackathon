"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

interface DashboardHeaderProps {
  activeTab: "employees" | "attendance" | "time_off";
  setActiveTab: (tab: "employees" | "attendance" | "time_off") => void;
  isCheckedIn?: boolean;
  checkInTime?: string | null;
  onToggleCheckIn?: () => void;
  onOpenMyProfile?: () => void;
}

export function DashboardHeader({
  activeTab,
  setActiveTab,
  isCheckedIn: propIsCheckedIn,
  checkInTime: propCheckInTime,
  onToggleCheckIn: propOnToggleCheckIn,
  onOpenMyProfile,
}: DashboardHeaderProps) {
  const {
    activeUser,
    logout,
    isCheckedIn: contextIsCheckedIn,
    checkInTime: contextCheckInTime,
    toggleCheckIn,
    attendanceLoading,
  } = useApp();

  const isCheckedIn = propIsCheckedIn !== undefined ? propIsCheckedIn : contextIsCheckedIn;
  const checkInTime = propCheckInTime !== undefined ? propCheckInTime : contextCheckInTime;
  const handleToggle = propOnToggleCheckIn || toggleCheckIn;

  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showSystrayMenu, setShowSystrayMenu] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const systrayMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setShowAvatarMenu(false);
      }
      if (systrayMenuRef.current && !systrayMenuRef.current.contains(event.target as Node)) {
        setShowSystrayMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  const userDisplayName = activeUser?.name || activeUser?.email?.split("@")[0] || "Alex Morgan";
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo & Navigation Tabs */}
        <div className="flex items-center gap-6 lg:gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 select-none hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 shadow-md flex items-center justify-center p-1.5 relative overflow-hidden flex-shrink-0">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500/30 rounded-full blur-md" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-600/40 rounded-full blur-md" />
              <svg className="w-6 h-6 relative z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 10C10 6 16 14 20 10C23 7 25 8 26 9.5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                <path d="M6 16C11 11 17 21 22 16C24.5 13.5 26 14.5 26 16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                <path d="M6 22C10 18 16 26 21 22.5C23.5 20.5 25.5 21.5 26 22.5" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight text-xl sm:text-2xl font-sans">
              DayFlow
            </span>
          </Link>

          {/* Module Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  router.push("/?tab=employees");
                } else {
                  setActiveTab("employees");
                }
              }}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "employees"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Employees
            </button>
            <button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  router.push("/?tab=attendance");
                } else {
                  setActiveTab("attendance");
                }
              }}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "attendance"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Attendance
            </button>
            <button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  router.push("/?tab=time_off");
                } else {
                  setActiveTab("time_off");
                }
              }}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "time_off"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              Time Off
            </button>
          </nav>
        </div>

        {/* Right: Systray Check-In & Profile Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Check In / Check Out Systray (Exact Wireframe Spec) */}
          <div className="relative" ref={systrayMenuRef}>
            <button
              onClick={() => setShowSystrayMenu(!showSystrayMenu)}
              title={isCheckedIn ? `Checked In since ${checkInTime}` : "Checked Out"}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
                isCheckedIn
                  ? "bg-emerald-950/40 border-emerald-800/50 hover:bg-emerald-950/60"
                  : "bg-rose-950/40 border-rose-800/50 hover:bg-rose-950/60"
              }`}
            >
              {/* Pulsing Status Dot: Green when in, Red when out */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isCheckedIn ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <span
                  className={`absolute w-3 h-3 rounded-full animate-ping opacity-75 ${
                    isCheckedIn ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-zinc-200 leading-tight">
                  {isCheckedIn ? "Checked IN" : "Checked OUT"}
                </span>
                {isCheckedIn && checkInTime && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    Since {checkInTime}
                  </span>
                )}
              </div>

              <svg
                className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                  showSystrayMenu ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Systray Dropdown Menu */}
            {showSystrayMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                <div className="border-b border-zinc-800/80 pb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Current Status</span>
                    <span
                      className={`font-semibold uppercase tracking-wider text-[11px] ${
                        isCheckedIn ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isCheckedIn ? "Present" : "Absent"}
                    </span>
                  </div>
                  {isCheckedIn && checkInTime && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Logged in at <span className="text-white font-medium">{checkInTime}</span>
                    </p>
                  )}
                </div>

                <button
                  disabled={attendanceLoading}
                  onClick={async () => {
                    await handleToggle();
                    setShowSystrayMenu(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCheckedIn
                      ? "bg-rose-600 hover:bg-rose-500 text-white"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  {attendanceLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : isCheckedIn ? (
                    <>
                      <span>Check Out</span>
                      <span>→</span>
                    </>
                  ) : (
                    <>
                      <span>Check IN</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar with Dropdown Menu (Exact Wireframe Spec) */}
          <div className="relative" ref={avatarMenuRef}>
            <button
              onClick={() => setShowAvatarMenu(!showAvatarMenu)}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-zinc-900 overflow-hidden flex items-center justify-center text-white font-bold text-sm">
                {userInitial}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showAvatarMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <p className="text-xs font-semibold text-white truncate">{userDisplayName}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{activeUser?.email || "alex.morgan@dayflow.internal"}</p>
                </div>

                <Link
                  href={activeUser?.role === "admin" ? "/profile" : "/profile/employee"}
                  onClick={() => setShowAvatarMenu(false)}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </Link>

                <button
                  onClick={async () => {
                    setShowAvatarMenu(false);
                    await logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-2.5 cursor-pointer mt-0.5"
                >
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Tab Row */}
      <div className="sm:hidden flex items-center justify-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800/80 mt-3">
        <button
          onClick={() => setActiveTab("employees")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center ${
            activeTab === "employees" ? "bg-indigo-600 text-white" : "text-zinc-400"
          }`}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center ${
            activeTab === "attendance" ? "bg-indigo-600 text-white" : "text-zinc-400"
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab("time_off")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center ${
            activeTab === "time_off" ? "bg-indigo-600 text-white" : "text-zinc-400"
          }`}
        >
          Time Off
        </button>
      </div>
    </header>
  );
}
