"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MockAttendance, MockEmployee, INITIAL_EMPLOYEES } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";

interface AttendanceViewProps {
  records: MockAttendance[];
  isCheckedIn: boolean;
  checkInTime: string | null;
  onToggleCheckIn: () => void;
  employees?: MockEmployee[];
}

export function AttendanceView({
  records,
  isCheckedIn,
  employees = INITIAL_EMPLOYEES,
}: AttendanceViewProps) {
  const { activeUser } = useApp();

  // Role detection
  const isActualAdmin = activeUser?.role === "admin";
  const [viewRole, setViewRole] = useState<"admin" | "employee">(
    isActualAdmin ? "admin" : "employee"
  );

  // Sync role if user changes
  useEffect(() => {
    setViewRole(activeUser?.role === "admin" ? "admin" : "employee");
  }, [activeUser]);

  // Max allowed benchmark date: Oct 22, 2025
  const maxAllowedDate = useMemo(() => {
    const d = new Date(2025, 9, 22);
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  // =========================================================================
  // ADMIN VIEW STATE
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState("");
  const [adminSelectedDate, setAdminSelectedDate] = useState<Date>(new Date(2025, 9, 22));
  const [showAdminCalendar, setShowAdminCalendar] = useState(false);
  const adminCalendarRef = useRef<HTMLDivElement>(null);

  // Close admin calendar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminCalendarRef.current && !adminCalendarRef.current.contains(event.target as Node)) {
        setShowAdminCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Admin Date Formatters
  const adminFormattedDateStr = useMemo(() => {
    const day = adminSelectedDate.getDate();
    const month = adminSelectedDate.toLocaleDateString("en-US", { month: "long" });
    const year = adminSelectedDate.getFullYear();
    return `${day}, ${month} ${year}`;
  }, [adminSelectedDate]);

  const adminFormattedDayStr = useMemo(() => {
    return adminSelectedDate.toLocaleDateString("en-US", { weekday: "long" });
  }, [adminSelectedDate]);

  const isAdminLatestDate = useMemo(() => {
    const checkDate = new Date(adminSelectedDate);
    checkDate.setHours(23, 59, 59, 999);
    return checkDate.getTime() >= maxAllowedDate.getTime();
  }, [adminSelectedDate, maxAllowedDate]);

  const handleAdminPrevDay = () => {
    setAdminSelectedDate((prev) => new Date(prev.getTime() - 86400000));
  };

  const handleAdminNextDay = () => {
    const nextDate = new Date(adminSelectedDate.getTime() + 86400000);
    if (nextDate.getTime() > maxAllowedDate.getTime()) {
      toast.error("Cannot select future dates.");
      return;
    }
    setAdminSelectedDate(nextDate);
  };

  const adminCalendarDays = useMemo(() => {
    const year = adminSelectedDate.getFullYear();
    const month = adminSelectedDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [adminSelectedDate]);

  // Admin All-Employee Records for selected date
  const adminFullAttendanceList = useMemo(() => {
    const dayOfMonth = adminSelectedDate.getDate();
    const isToday = isAdminLatestDate;
    const isWeekend = adminSelectedDate.getDay() === 0 || adminSelectedDate.getDay() === 6;

    return employees.map((emp, index) => {
      const seed = (emp.id.charCodeAt(emp.id.length - 1) + dayOfMonth * 13 + index * 7) % 100;

      if (isWeekend) {
        return {
          id: `ATT-ROW-${emp.id}-${dayOfMonth}`,
          employeeId: emp.id,
          employeeName: emp.name,
          avatar: emp.avatar,
          department: emp.department,
          role: emp.role,
          checkIn: "—",
          checkOut: "—",
          workHours: "00:00 hrs",
          extraHours: "—",
          status: "weekend" as const,
        };
      }

      if (isToday) {
        const existing = records.find((r) => r.employeeId === emp.id || r.employeeName === emp.name);
        const checkIn = emp.status === "present" ? (emp.checkInTime || "10:00 AM") : (existing?.checkIn || "—");
        const checkOut = emp.status === "present" ? (index % 2 === 0 ? "07:00 PM" : "Active") : (existing?.checkOut || "—");
        const workHours = emp.status === "present" ? (index % 2 === 0 ? "09:00 hrs" : "05:15 hrs") : "00:00 hrs";
        const extraHours = emp.status === "present" ? (index % 2 === 0 ? "+01:00 hrs" : "+00:00 hrs") : "—";
        const status = emp.status === "present" ? "on_time" : (emp.status === "on_leave" ? "on_leave" : "absent");

        return {
          id: `ATT-ROW-${emp.id}`,
          employeeId: emp.id,
          employeeName: emp.name,
          avatar: emp.avatar,
          department: emp.department,
          role: emp.role,
          checkIn,
          checkOut,
          workHours,
          extraHours,
          status,
        };
      }

      if (seed < 12) {
        return {
          id: `ATT-ROW-${emp.id}-${dayOfMonth}`,
          employeeId: emp.id,
          employeeName: emp.name,
          avatar: emp.avatar,
          department: emp.department,
          role: emp.role,
          checkIn: "—",
          checkOut: "—",
          workHours: "00:00 hrs",
          extraHours: "—",
          status: "absent" as const,
        };
      } else if (seed < 22) {
        return {
          id: `ATT-ROW-${emp.id}-${dayOfMonth}`,
          employeeId: emp.id,
          employeeName: emp.name,
          avatar: emp.avatar,
          department: emp.department,
          role: emp.role,
          checkIn: "—",
          checkOut: "—",
          workHours: "00:00 hrs",
          extraHours: "—",
          status: "on_leave" as const,
        };
      } else {
        const checkInHour = seed % 2 === 0 ? "08:45 AM" : (seed % 3 === 0 ? "09:12 AM" : "09:00 AM");
        const checkOutHour = seed % 2 === 0 ? "06:15 PM" : (seed % 3 === 0 ? "05:30 PM" : "06:45 PM");
        const hours = seed % 2 === 0 ? "09:30 hrs" : (seed % 3 === 0 ? "08:18 hrs" : "09:45 hrs");
        const extra = seed % 2 === 0 ? "+01:30 hrs" : (seed % 3 === 0 ? "+00:18 hrs" : "+01:45 hrs");
        const status = seed % 3 === 0 ? "late" : "on_time";

        return {
          id: `ATT-ROW-${emp.id}-${dayOfMonth}`,
          employeeId: emp.id,
          employeeName: emp.name,
          avatar: emp.avatar,
          department: emp.department,
          role: emp.role,
          checkIn: checkInHour,
          checkOut: checkOutHour,
          workHours: hours,
          extraHours: extra,
          status,
        };
      }
    });
  }, [employees, records, adminSelectedDate, isAdminLatestDate]);

  const adminFilteredRecords = useMemo(() => {
    return adminFullAttendanceList.filter((item) => {
      return (
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [adminFullAttendanceList, searchQuery]);

  const adminPresentCount = adminFullAttendanceList.filter((e) => e.status === "on_time" || e.status === "late").length;
  const adminOnLeaveCount = adminFullAttendanceList.filter((e) => e.status === "on_leave").length;
  const adminAbsentCount = adminFullAttendanceList.filter((e) => e.status === "absent").length;

  // =========================================================================
  // EMPLOYEE VIEW STATE (From Employee Wireframe)
  // =========================================================================
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(new Date(2025, 9, 1)); // Oct 2025
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);

  // Close month dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setShowMonthDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const employeeFormattedMonthShort = useMemo(() => {
    return selectedMonthDate.toLocaleDateString("en-US", { month: "short" });
  }, [selectedMonthDate]);

  const employeeFormattedMonthFull = useMemo(() => {
    return selectedMonthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [selectedMonthDate]);

  const handleEmpPrevMonth = () => {
    setSelectedMonthDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleEmpNextMonth = () => {
    const nextM = new Date(selectedMonthDate);
    nextM.setMonth(nextM.getMonth() + 1);
    if (nextM.getFullYear() > 2025 || (nextM.getFullYear() === 2025 && nextM.getMonth() > 9)) {
      toast.error("Cannot view attendance for future months.");
      return;
    }
    setSelectedMonthDate(nextM);
  };

  // Generate Day-Wise Attendance List for the Logged In Employee
  const employeeMonthRecords = useMemo(() => {
    const year = selectedMonthDate.getFullYear();
    const month = selectedMonthDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const benchmarkDay = 22; // Oct 22, 2025
    const isCurrentBenchmarkMonth = year === 2025 && month === 9;

    const list = [];
    let presentCounter = 0;
    let leavesCounter = 0;
    let totalWorkingDaysCounter = 0;

    for (let day = totalDays; day >= 1; day--) {
      const dateObj = new Date(year, month, day);
      const isFutureInCurrentMonth = isCurrentBenchmarkMonth && day > benchmarkDay;
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

      const datePadded = `${String(day).padStart(2, "0")}/${String(month + 1).padStart(2, "0")}/${year}`;
      const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });

      if (isWeekend) {
        list.push({
          dayNum: day,
          date: datePadded,
          dayName,
          checkIn: "—",
          checkOut: "—",
          workHours: "00:00",
          extraHours: "—",
          status: "weekend" as const,
          statusLabel: "Weekend",
        });
        continue;
      }

      totalWorkingDaysCounter++;

      if (isFutureInCurrentMonth) {
        list.push({
          dayNum: day,
          date: datePadded,
          dayName,
          checkIn: "—",
          checkOut: "—",
          workHours: "—",
          extraHours: "—",
          status: "future" as const,
          statusLabel: "Scheduled",
        });
        continue;
      }

      // Today (Oct 22, 2025)
      if (isCurrentBenchmarkMonth && day === benchmarkDay) {
        presentCounter++;
        list.push({
          dayNum: day,
          date: datePadded,
          dayName,
          checkIn: isCheckedIn ? "10:00" : "08:45",
          checkOut: isCheckedIn ? "In Progress" : "19:00",
          workHours: isCheckedIn ? "05:15" : "09:00",
          extraHours: isCheckedIn ? "+00:00" : "01:00",
          status: "present" as const,
          statusLabel: isCheckedIn ? "In Progress" : "Present",
        });
        continue;
      }

      // Past Days
      const seed = (day * 17) % 30;
      if (seed === 7 || seed === 18) {
        // Leave
        leavesCounter++;
        list.push({
          dayNum: day,
          date: datePadded,
          dayName,
          checkIn: "—",
          checkOut: "—",
          workHours: "00:00",
          extraHours: "—",
          status: "on_leave" as const,
          statusLabel: "Approved Leave",
        });
      } else {
        // Present
        presentCounter++;
        const checkInTime = seed % 3 === 0 ? "09:45" : (seed % 2 === 0 ? "10:00" : "09:15");
        const checkOutTime = seed % 3 === 0 ? "18:45" : (seed % 2 === 0 ? "19:00" : "18:30");
        const workH = seed % 2 === 0 ? "09:00" : "08:30";
        const extraH = seed % 2 === 0 ? "01:00" : "00:30";

        list.push({
          dayNum: day,
          date: datePadded,
          dayName,
          checkIn: checkInTime,
          checkOut: checkOutTime,
          workHours: workH,
          extraHours: extraH,
          status: "present" as const,
          statusLabel: "Present",
        });
      }
    }

    return {
      records: list,
      presentCount: presentCounter,
      leavesCount: leavesCounter,
      totalWorkingDays: totalWorkingDaysCounter,
    };
  }, [selectedMonthDate, isCheckedIn]);

  const monthOptions = [
    { label: "January 2025", month: 0, year: 2025 },
    { label: "February 2025", month: 1, year: 2025 },
    { label: "March 2025", month: 2, year: 2025 },
    { label: "April 2025", month: 3, year: 2025 },
    { label: "May 2025", month: 4, year: 2025 },
    { label: "June 2025", month: 5, year: 2025 },
    { label: "July 2025", month: 6, year: 2025 },
    { label: "August 2025", month: 7, year: 2025 },
    { label: "September 2025", month: 8, year: 2025 },
    { label: "October 2025", month: 9, year: 2025 },
  ];

  return (
    <div className="w-full space-y-6 text-left">
      
      {/* =================================================================== */}
      {/* 1. ADMIN ATTENDANCE VIEW                                            */}
      {/* =================================================================== */}
      {viewRole === "admin" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Control Bar with elevated z-index for dropdown calendar */}
          <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 relative z-30">
            
            {/* Row 1: Header Title & Bigger Search Bar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shadow-inner">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    Attendance
                  </h2>
                </div>
              </div>

              {/* Bigger Search Bar */}
              <div className="w-full lg:w-[420px] relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employee name, department, ID..."
                  className="w-full pl-11 pr-4 py-3 bg-zinc-950/90 border border-zinc-800 focus:border-indigo-500 rounded-2xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all shadow-inner"
                />
                <svg
                  className="w-5 h-5 text-zinc-400 absolute left-3.5 top-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Row 2: Date Navigation, Calendar Dropdown & Day Capsule */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800/60 relative">
              
              {/* Navigation Controls: [ < ] [ > ] [ Date ▾ ] [ Day ] */}
              <div className="flex items-center gap-2.5 relative" ref={adminCalendarRef}>
                
                {/* Prev Day Button */}
                <button
                  onClick={handleAdminPrevDay}
                  className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer active:scale-95"
                  title="Previous Day"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Day Button */}
                <button
                  onClick={handleAdminNextDay}
                  disabled={isAdminLatestDate}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isAdminLatestDate
                      ? "bg-zinc-950/40 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-40"
                      : "bg-zinc-950/90 border-zinc-800 hover:bg-zinc-800 text-zinc-300 cursor-pointer active:scale-95"
                  }`}
                  title={isAdminLatestDate ? "Cannot navigate to future dates" : "Next Day"}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Date Selector Dropdown Button (Opens Interactive Calendar) */}
                <button
                  type="button"
                  onClick={() => setShowAdminCalendar(!showAdminCalendar)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer select-none"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{adminFormattedDateStr}</span>
                  <svg className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showAdminCalendar ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Day Capsule (Automatically updates with the date) */}
                <div className="px-4 py-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-xs sm:text-sm font-bold text-indigo-300 select-none">
                  Day: {adminFormattedDayStr}
                </div>

                {/* Interactive Calendar Dropdown Modal */}
                {showAdminCalendar && (
                  <div className="absolute top-14 left-0 z-50 w-72 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {adminSelectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const newD = new Date(adminSelectedDate);
                            newD.setMonth(newD.getMonth() - 1);
                            setAdminSelectedDate(newD);
                          }}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const newD = new Date(adminSelectedDate);
                            newD.setMonth(newD.getMonth() + 1);
                            if (newD.getTime() <= maxAllowedDate.getTime()) {
                              setAdminSelectedDate(newD);
                            } else {
                              toast.error("Cannot navigate to future months.");
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 mb-2">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {adminCalendarDays.map((d, index) => {
                        if (d === null) return <div key={`empty-${index}`} className="h-7 w-7" />;
                        const cellDate = new Date(adminSelectedDate.getFullYear(), adminSelectedDate.getMonth(), d);
                        const isCellFuture = cellDate.getTime() > maxAllowedDate.getTime();
                        const isSelected = d === adminSelectedDate.getDate();

                        return (
                          <button
                            key={d}
                            disabled={isCellFuture}
                            onClick={() => {
                              if (isCellFuture) return;
                              const newD = new Date(adminSelectedDate);
                              newD.setDate(d);
                              setAdminSelectedDate(newD);
                              setShowAdminCalendar(false);
                            }}
                            className={`h-7 w-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                              isCellFuture
                                ? "text-zinc-600 cursor-not-allowed opacity-30 select-none"
                                : isSelected
                                ? "bg-indigo-600 text-white shadow-md font-bold cursor-pointer"
                                : "text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                            }`}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-3 mt-3 border-t border-zinc-800/80 text-center">
                      <button
                        onClick={() => {
                          setAdminSelectedDate(new Date(2025, 9, 22));
                          setShowAdminCalendar(false);
                        }}
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        Reset to Today (22 Oct 2025)
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Quick Stats Pill Badges for Selected Date */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-medium">
                  Present: <strong>{adminPresentCount}</strong>
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-medium">
                  On Leave: <strong>{adminOnLeaveCount}</strong>
                </span>
                <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 font-medium">
                  Absent: <strong>{adminAbsentCount}</strong>
                </span>
              </div>

            </div>

          </div>

          {/* Admin Attendance Table */}
          <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl relative z-10">
            
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono font-medium">
                  {adminFormattedDateStr} ({adminFormattedDayStr})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Emp</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work Hours</th>
                    <th className="px-6 py-4">Extra hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {adminFilteredRecords.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                            <img src={row.avatar} alt={row.employeeName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm">{row.employeeName}</div>
                            <div className="text-[11px] text-zinc-400 font-mono">{row.employeeId} • {row.department}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                        {row.checkIn}
                      </td>

                      <td className="px-6 py-4 font-mono whitespace-nowrap">
                        {row.checkOut === "Active" ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            In Progress
                          </span>
                        ) : (
                          <span className="text-zinc-300">{row.checkOut}</span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-mono font-medium text-white whitespace-nowrap">
                        {row.workHours}
                      </td>

                      <td className="px-6 py-4 font-mono whitespace-nowrap">
                        {row.extraHours !== "—" && row.extraHours !== "+00:00 hrs" ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-xs">
                            {row.extraHours}
                          </span>
                        ) : (
                          <span className="text-zinc-500">{row.extraHours}</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            row.status === "on_time"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                              : row.status === "late"
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                              : row.status === "on_leave"
                              ? "bg-blue-950/80 text-blue-400 border border-blue-800/60"
                              : row.status === "weekend"
                              ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                              : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                          }`}
                        >
                          {row.status === "on_time"
                            ? "Present"
                            : row.status === "late"
                            ? "Late Arrival"
                            : row.status === "on_leave"
                            ? "On Leave"
                            : row.status === "weekend"
                            ? "Weekend / Off"
                            : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>{adminFilteredRecords.length} Employees Filtered</span>
              <span>{adminFormattedDateStr}</span>
            </div>

          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 2. EMPLOYEE ATTENDANCE VIEW (Exact Wireframe "For Employees")         */}
      {/* =================================================================== */}
      {viewRole === "employee" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Employee Top Control Bar (Matching Wireframe: [ < ] [ > ] [ Oct v ] [ Count of days present ] [ Leaves count ] [ Total working days ]) */}
          <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 relative z-30">
            
            {/* Header Title */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shadow-inner">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    Attendance
                  </h2>
                </div>
              </div>
            </div>

            {/* Navigation & Presence Metric Capsules (Exact Wireframe Architecture) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              
              {/* Month Selector Group: [ < ] [ > ] [ Oct ▾ ] */}
              <div className="flex items-center gap-2.5 relative" ref={monthDropdownRef}>
                
                {/* Prev Month Button */}
                <button
                  onClick={handleEmpPrevMonth}
                  className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer active:scale-95"
                  title="Previous Month"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Month Button */}
                <button
                  onClick={handleEmpNextMonth}
                  className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer active:scale-95"
                  title="Next Month"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Month Dropdown Button [ Oct ▾ ] */}
                <button
                  type="button"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer select-none"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{employeeFormattedMonthShort} ▾</span>
                </button>

                {/* Interactive Month Picker Modal */}
                {showMonthDropdown && (
                  <div className="absolute top-14 left-0 z-50 w-56 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1 border-b border-zinc-800">
                      Select Month (2025)
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-1 pt-1 scrollbar-thin">
                      {monthOptions.map((opt) => {
                        const isSelected = selectedMonthDate.getMonth() === opt.month && selectedMonthDate.getFullYear() === opt.year;
                        return (
                          <button
                            key={opt.label}
                            onClick={() => {
                              setSelectedMonthDate(new Date(opt.year, opt.month, 1));
                              setShowMonthDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-indigo-600 text-white"
                                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* 3 Metric Capsules from Wireframe: [ Count of days present ] [ Leaves count ] [ Total working days ] */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                
                {/* 1. Count of days present */}
                <div className="px-4 py-2 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                  <span className="text-zinc-400 font-medium">Count of days present:</span>
                  <strong className="text-emerald-400 font-bold font-mono">{employeeMonthRecords.presentCount}</strong>
                </div>

                {/* 2. Leaves count */}
                <div className="px-4 py-2 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-300 flex items-center gap-2">
                  <span className="text-zinc-400 font-medium">Leaves count:</span>
                  <strong className="text-amber-400 font-bold font-mono">{employeeMonthRecords.leavesCount}</strong>
                </div>

                {/* 3. Total working days */}
                <div className="px-4 py-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-2">
                  <span className="text-indigo-400 font-medium">Total working days:</span>
                  <strong className="text-white font-bold font-mono">{employeeMonthRecords.totalWorkingDays}</strong>
                </div>

              </div>

            </div>

          </div>

          {/* Employee Day-Wise Attendance Table (Exact Table Columns from Wireframe) */}
          <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl relative z-10">
            
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono font-medium">
                  {employeeFormattedMonthFull} • Day-wise Attendance Sheet
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Check In</th>
                    <th className="px-6 py-4">Check Out</th>
                    <th className="px-6 py-4">Work Hours</th>
                    <th className="px-6 py-4">Extra hours</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {employeeMonthRecords.records.map((row, idx) => (
                    <tr key={`emp-row-${idx}`} className="hover:bg-zinc-800/40 transition-colors">
                      
                      {/* Date Column */}
                      <td className="px-6 py-4 font-mono font-medium text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{row.date}</span>
                          <span className="text-[11px] text-zinc-500 font-sans">({row.dayName})</span>
                        </div>
                      </td>

                      {/* Check In */}
                      <td className="px-6 py-4 font-mono whitespace-nowrap">
                        {row.checkIn !== "—" ? (
                          <span className="text-emerald-400 font-semibold">{row.checkIn}</span>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Check Out */}
                      <td className="px-6 py-4 font-mono whitespace-nowrap">
                        {row.checkOut === "In Progress" ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            In Progress
                          </span>
                        ) : row.checkOut !== "—" ? (
                          <span className="text-zinc-300">{row.checkOut}</span>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Work Hours */}
                      <td className="px-6 py-4 font-mono whitespace-nowrap">
                        {row.workHours !== "—" && row.workHours !== "00:00" ? (
                          <span className="text-white font-medium">{row.workHours}</span>
                        ) : (
                          <span className="text-zinc-500">{row.workHours}</span>
                        )}
                      </td>

                      {/* Extra Hours */}
                      <td className="px-6 py-4 font-mono whitespace-nowrap">
                        {row.extraHours !== "—" ? (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-xs">
                            {row.extraHours}
                          </span>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            row.status === "present"
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                              : row.status === "on_leave"
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                              : row.status === "weekend"
                              ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                              : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                          }`}
                        >
                          {row.statusLabel}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>{employeeMonthRecords.records.length} Days Recorded</span>
              <span>{employeeFormattedMonthFull}</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
