"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MockAttendance, MockEmployee, INITIAL_EMPLOYEES } from "@/data/mockData";
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
  // Max allowed date (Current Benchmark Date: Oct 22, 2025)
  const maxAllowedDate = useMemo(() => {
    const d = new Date(2025, 9, 22);
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  // Search & Date State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 9, 22)); // 22 Oct 2025
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format Helpers
  const formattedDateStr = useMemo(() => {
    const day = selectedDate.getDate();
    const month = selectedDate.toLocaleDateString("en-US", { month: "long" });
    const year = selectedDate.getFullYear();
    return `${day}, ${month} ${year}`;
  }, [selectedDate]);

  const formattedDayStr = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  }, [selectedDate]);

  // Is Selected Date the latest allowed (today)
  const isLatestDate = useMemo(() => {
    const checkDate = new Date(selectedDate);
    checkDate.setHours(23, 59, 59, 999);
    return checkDate.getTime() >= maxAllowedDate.getTime();
  }, [selectedDate, maxAllowedDate]);

  // Navigate Days (Validated against future dates)
  const handlePrevDay = () => {
    setSelectedDate((prev) => new Date(prev.getTime() - 86400000));
  };

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate.getTime() + 86400000);
    if (nextDate.getTime() > maxAllowedDate.getTime()) {
      toast.error("Cannot select future dates.");
      return;
    }
    setSelectedDate(nextDate);
  };

  // Calendar Days Computation
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [selectedDate]);

  // Dynamic Day-Wise Attendance List based on selected date
  const fullAttendanceList = useMemo(() => {
    const dayOfMonth = selectedDate.getDate();
    const isToday = isLatestDate;
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;

    return employees.map((emp, index) => {
      // Deterministic seed per employee and selected date
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
        // Today's Live Attendance
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

      // Past Date Historical Record
      if (seed < 12) {
        // Absent on this past date
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
        // On Leave on this past date
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
        // Present on this past date
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
  }, [employees, records, selectedDate, isLatestDate]);

  // Filtered List based on Search Query
  const filteredRecords = useMemo(() => {
    return fullAttendanceList.filter((item) => {
      const matchSearch =
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [fullAttendanceList, searchQuery]);

  // Summary Metrics for the selected date
  const presentCount = fullAttendanceList.filter((e) => e.status === "on_time" || e.status === "late").length;
  const onLeaveCount = fullAttendanceList.filter((e) => e.status === "on_leave").length;
  const absentCount = fullAttendanceList.filter((e) => e.status === "absent").length;

  return (
    <div className="w-full space-y-6 text-left">
      
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
          <div className="flex items-center gap-2.5 relative" ref={calendarRef}>
            
            {/* Prev Day Button */}
            <button
              onClick={handlePrevDay}
              className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 transition-colors cursor-pointer active:scale-95"
              title="Previous Day"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Day Button (Disabled if on or after max allowed date) */}
            <button
              onClick={handleNextDay}
              disabled={isLatestDate}
              className={`p-2.5 rounded-xl border transition-colors ${
                isLatestDate
                  ? "bg-zinc-950/40 border-zinc-800/40 text-zinc-600 cursor-not-allowed opacity-40"
                  : "bg-zinc-950/90 border-zinc-800 hover:bg-zinc-800 text-zinc-300 cursor-pointer active:scale-95"
              }`}
              title={isLatestDate ? "Cannot navigate to future dates" : "Next Day"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Date Selector Dropdown Button (Opens Interactive Calendar) */}
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer select-none"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formattedDateStr}</span>
              <svg className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showCalendar ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Day Capsule (Automatically updates with the date) */}
            <div className="px-4 py-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-xs sm:text-sm font-bold text-indigo-300 select-none">
              Day: {formattedDayStr}
            </div>

            {/* Interactive Calendar Dropdown Modal (Strictly Validated - No Future Dates) */}
            {showCalendar && (
              <div className="absolute top-14 left-0 z-50 w-72 bg-zinc-900/95 border border-zinc-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                {/* Month/Year Header */}
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const newD = new Date(selectedDate);
                        newD.setMonth(newD.getMonth() - 1);
                        setSelectedDate(newD);
                      }}
                      className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        const newD = new Date(selectedDate);
                        newD.setMonth(newD.getMonth() + 1);
                        if (newD.getTime() <= maxAllowedDate.getTime()) {
                          setSelectedDate(newD);
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

                {/* Day of Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 mb-2">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                {/* Calendar Days Grid (Future Dates Disabled) */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, index) => {
                    if (d === null) {
                      return <div key={`empty-${index}`} className="h-7 w-7" />;
                    }
                    const cellDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d);
                    const isCellFuture = cellDate.getTime() > maxAllowedDate.getTime();
                    const isSelected = d === selectedDate.getDate();

                    return (
                      <button
                        key={d}
                        disabled={isCellFuture}
                        onClick={() => {
                          if (isCellFuture) return;
                          const newD = new Date(selectedDate);
                          newD.setDate(d);
                          setSelectedDate(newD);
                          setShowCalendar(false);
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

                {/* Today Quick Select */}
                <div className="pt-3 mt-3 border-t border-zinc-800/80 text-center">
                  <button
                    onClick={() => {
                      setSelectedDate(new Date(2025, 9, 22));
                      setShowCalendar(false);
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
              Present: <strong>{presentCount}</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 font-medium">
              On Leave: <strong>{onLeaveCount}</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 font-medium">
              Absent: <strong>{absentCount}</strong>
            </span>
          </div>

        </div>

      </div>

      {/* Attendance Table */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl relative z-10">
        
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono font-medium">
              {formattedDateStr} ({formattedDayStr})
            </span>
          </div>
        </div>

        {/* Responsive Table */}
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
              {filteredRecords.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-800/40 transition-colors">
                  
                  {/* Emp Column (Avatar, Name, ID, Department) */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                        <img
                          src={row.avatar}
                          alt={row.employeeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">
                          {row.employeeName}
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          {row.employeeId} • {row.department}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Check In */}
                  <td className="px-6 py-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                    {row.checkIn}
                  </td>

                  {/* Check Out */}
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

                  {/* Work Hours */}
                  <td className="px-6 py-4 font-mono font-medium text-white whitespace-nowrap">
                    {row.workHours}
                  </td>

                  {/* Extra Hours */}
                  <td className="px-6 py-4 font-mono whitespace-nowrap">
                    {row.extraHours !== "—" && row.extraHours !== "+00:00 hrs" ? (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-xs">
                        {row.extraHours}
                      </span>
                    ) : (
                      <span className="text-zinc-500">{row.extraHours}</span>
                    )}
                  </td>

                  {/* Status */}
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

        {/* Table Footer */}
        <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>{filteredRecords.length} Employees Filtered</span>
          <span>{formattedDateStr}</span>
        </div>

      </div>

    </div>
  );
}
