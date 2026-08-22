"use client";

import { useState, useMemo, useRef } from "react";
import { MockTimeOff, MockEmployee, INITIAL_EMPLOYEES } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";

interface TimeOffViewProps {
  requests: MockTimeOff[];
  onRequestTimeOff: (newRequest: MockTimeOff) => void;
  onApproveRequest?: (id: string) => void;
  onRejectRequest?: (id: string) => void;
  employees?: MockEmployee[];
}

export function TimeOffView({
  requests,
  onRequestTimeOff,
  onApproveRequest,
  onRejectRequest,
  employees = INITIAL_EMPLOYEES,
}: TimeOffViewProps) {
  const { activeUser } = useApp();

  // Role detection
  const isAdmin = activeUser?.role === "admin";

  // Sub-Navigation (For Admin): "time_off" | "allocation"
  const [subTab, setSubTab] = useState<"time_off" | "allocation">("time_off");

  // Admin Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveType, setLeaveType] = useState<string>("Paid Time off");
  const [startDate, setStartDate] = useState("2026-05-13");
  const [endDate, setEndDate] = useState("2026-05-14");
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [reason, setReason] = useState("Medical recovery rest");
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-calculated Allocation Days in Format: "01.00 Days"
  const calculatedAllocationDays = useMemo(() => {
    if (!startDate || !endDate) return "01.00 Days";
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return "00.00 Days";
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${String(diffDays).padStart(2, "0")}.00 Days`;
  }, [startDate, endDate]);

  // Initial Requests State with demo leave applications
  const [localRequests, setLocalRequests] = useState<MockTimeOff[]>([
    {
      id: "TO-301",
      employeeId: "EMP-001",
      employeeName: "Alex Morgan",
      type: "Paid Time off" as any,
      startDate: "28/10/2026",
      endDate: "28/10/2026",
      days: 1,
      status: "pending",
      reason: "Personal appointment",
    },
    {
      id: "TO-302",
      employeeId: "EMP-002",
      employeeName: "Sarah Chen",
      type: "Sick Leave" as any,
      startDate: "29/10/2026",
      endDate: "30/10/2026",
      days: 2,
      status: "pending",
      reason: "Doctor consultation & recovery",
    },
    {
      id: "TO-303",
      employeeId: "EMP-004",
      employeeName: "Elena Rostova",
      type: "Paid Time off" as any,
      startDate: "24/10/2026",
      endDate: "25/10/2026",
      days: 2,
      status: "approved",
      reason: "Family gathering",
    },
    {
      id: "TO-304",
      employeeId: "EMP-006",
      employeeName: "Olivia Thorne",
      type: "Unpaid Leaves" as any,
      startDate: "18/10/2026",
      endDate: "18/10/2026",
      days: 1,
      status: "approved",
      reason: "Personal commitment",
    },
    ...requests.map((r) => ({
      ...r,
      startDate: r.startDate.includes("/") ? r.startDate : "28/10/2026",
      endDate: r.endDate.includes("/") ? r.endDate : "28/10/2026",
      type: (r.type === "Annual Leave" ? "Paid Time off" : r.type === "Sick Leave" ? "Sick Leave" : "Unpaid Leaves") as any,
    })),
  ]);

  // Admin Approve Handler
  const handleApprove = (id: string, name: string) => {
    setLocalRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );
    if (onApproveRequest) onApproveRequest(id);
    toast.success(`Approved time off for ${name}`);
  };

  // Admin Reject Handler
  const handleReject = (id: string, name: string) => {
    setLocalRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
    if (onRejectRequest) onRejectRequest(id);
    toast.error(`Rejected time off request for ${name}`);
  };

  // Submit Application Handler
  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!startDate || !endDate) {
      setFormError("Please select both start and end dates.");
      toast.error("Please select both start and end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setFormError("End date cannot be earlier than start date.");
      toast.error("End date cannot be earlier than start date.");
      return;
    }

    const formatToDDMMYYYY = (iso: string) => {
      const parts = iso.split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return iso;
    };

    const newReq: MockTimeOff = {
      id: `TO-${Date.now()}`,
      employeeId: activeUser?.id || "EMP-001",
      employeeName: activeUser?.name || "Alex Morgan",
      type: leaveType as any,
      startDate: formatToDDMMYYYY(startDate),
      endDate: formatToDDMMYYYY(endDate),
      days: parseInt(calculatedAllocationDays.slice(0, 2), 10) || 1,
      status: "pending",
      reason: reason.trim() || `${leaveType} request`,
    };

    setLocalRequests((prev) => [newReq, ...prev]);
    onRequestTimeOff(newReq);
    toast.success("Time off request submitted successfully!");
    setShowRequestModal(false);
    setAttachedFileName(null);
  };

  // Public Holidays List (2026) matching wireframe
  const publicHolidays = [
    { date: "Jan 14, 2026", month: 0, day: 14, name: "Kite Festival" },
    { date: "Jan 26, 2026", month: 0, day: 26, name: "Republic Day" },
    { date: "Mar 4, 2026", month: 2, day: 4, name: "Dhuleti" },
    { date: "Aug 15, 2026", month: 7, day: 15, name: "Independence Day" },
    { date: "Aug 28, 2026", month: 7, day: 28, name: "Rakhi" },
    { date: "Oct 2, 2026", month: 9, day: 2, name: "Gandhi Jayanti" },
    { date: "Nov 8, 2026", month: 10, day: 8, name: "Diwali" },
    { date: "Nov 10, 2026", month: 10, day: 10, name: "New Year" },
    { date: "Nov 11, 2026", month: 10, day: 11, name: "Bhai Duj" },
  ];

  // 12 Months Definitions for 2026
  const months2026 = [
    { name: "January 2026", monthIndex: 0, days: 31, startDay: 4 }, // Thursday
    { name: "February 2026", monthIndex: 1, days: 28, startDay: 0 }, // Sunday
    { name: "March 2026", monthIndex: 2, days: 31, startDay: 0 },
    { name: "April 2026", monthIndex: 3, days: 30, startDay: 3 },
    { name: "May 2026", monthIndex: 4, days: 31, startDay: 5 },
    { name: "June 2026", monthIndex: 5, days: 30, startDay: 1 },
    { name: "July 2026", monthIndex: 6, days: 31, startDay: 3 },
    { name: "August 2026", monthIndex: 7, days: 31, startDay: 6 },
    { name: "September 2026", monthIndex: 8, days: 30, startDay: 2 },
    { name: "October 2026", monthIndex: 9, days: 31, startDay: 4 },
    { name: "November 2026", monthIndex: 10, days: 30, startDay: 0 },
    { name: "December 2026", monthIndex: 11, days: 31, startDay: 2 },
  ];

  // Search Filter for Admin Table
  const finalFilteredRequests = useMemo(() => {
    return localRequests.filter((r) => {
      const matchSearch =
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.startDate.includes(searchQuery) ||
        r.endDate.includes(searchQuery);
      return matchSearch;
    });
  }, [localRequests, searchQuery]);

  return (
    <div className="w-full space-y-6 text-left">
      
      {/* =================================================================== */}
      {/* 1. ADMIN TIME OFF VIEW (Table + Approve/Reject Buttons)              */}
      {/* =================================================================== */}
      {isAdmin ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Control Bar */}
          <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            
            {/* Header with Sub-Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shadow-inner">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    Time Off
                  </h2>
                </div>
              </div>

              {/* Sub-Tabs: [ Time Off ] | [ Allocation ] */}
              <div className="flex items-center bg-zinc-950/90 p-1.5 rounded-2xl border border-zinc-800 text-xs sm:text-sm font-semibold">
                <button
                  onClick={() => setSubTab("time_off")}
                  className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                    subTab === "time_off"
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Time Off
                </button>
                <button
                  onClick={() => setSubTab("allocation")}
                  className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                    subTab === "allocation"
                      ? "bg-indigo-600 text-white shadow-md font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Allocation
                </button>
              </div>
            </div>

            {/* Time Off Tab Action Controls */}
            {subTab === "time_off" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                
                {/* Action Row: [ NEW ] Button + Searchbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      setFormError(null);
                      setShowRequestModal(true);
                    }}
                    className="px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-purple-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>NEW</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>

                  <div className="w-full sm:w-[480px] relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by employee name, time off type, date, status..."
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

                {/* Balance Capsules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-inner">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-indigo-300">Paid time Off</h4>
                      <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                        24 <span className="text-xs sm:text-sm font-normal text-zinc-400">Days Available</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 text-lg">🌴</div>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-inner">
                    <div>
                      <h4 className="text-sm sm:text-base font-semibold text-emerald-300">Sick time off</h4>
                      <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                        07 <span className="text-xs sm:text-sm font-normal text-zinc-400">Days Available</span>
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-lg">🏥</div>
                  </div>
                </div>

              </div>
            )}

            {/* Allocation Tab */}
            {subTab === "allocation" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-2">
                    <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Paid Time Off</div>
                    <div className="text-2xl font-bold text-white">24 Days / Year</div>
                    <div className="text-xs text-zinc-500">20 Days Remaining • 4 Days Used</div>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-2">
                    <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Sick Leave</div>
                    <div className="text-2xl font-bold text-white">12 Days / Year</div>
                    <div className="text-xs text-zinc-500">7 Days Remaining • 5 Days Used</div>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-2">
                    <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Unpaid Leaves</div>
                    <div className="text-2xl font-bold text-white">Allowed Policy</div>
                    <div className="text-xs text-zinc-500">Manager Approval Required</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Admin Table */}
          <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono font-medium">Time Off Records Table</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-300">
                <thead className="bg-zinc-950/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Start Date</th>
                    <th className="px-6 py-4">End Date</th>
                    <th className="px-6 py-4">Time off Type</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {finalFilteredRequests.map((row) => {
                    const emp = employees.find((e) => e.id === row.employeeId || e.name === row.employeeName);
                    const avatar = emp?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

                    return (
                      <tr key={row.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                              <img src={avatar} alt={row.employeeName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">{row.employeeName}</div>
                              <div className="text-[11px] text-zinc-400 font-mono">{row.employeeId}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono whitespace-nowrap text-zinc-200">{row.startDate}</td>
                        <td className="px-6 py-4 font-mono whitespace-nowrap text-zinc-200">{row.endDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-300">{row.type}</td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {row.status === "pending" ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleReject(row.id, row.employeeName)}
                                className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/70 text-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                title="Reject Request"
                              >
                                <span>❌</span>
                                <span className="hidden sm:inline">Reject</span>
                              </button>

                              <button
                                onClick={() => handleApprove(row.id, row.employeeName)}
                                className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/70 text-emerald-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                title="Approve Request"
                              >
                                <span>✔️</span>
                                <span className="hidden sm:inline">Approve</span>
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                row.status === "approved"
                                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                                  : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                              }`}
                            >
                              {row.status === "approved" ? "Approved" : "Rejected"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        /* =================================================================== */
        /* 2. DEDICATED EMPLOYEE TIME OFF VIEW (Exact Wireframe 1 & 2)         */
        /* =================================================================== */
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Control Bar with [ NEW ] and Balance Overview */}
          <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            
            {/* Header with [ Time Off ] Sub-Tab & [ NEW ] Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 shadow-inner">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    Time Off
                  </h2>
                </div>
              </div>

              {/* [ NEW ] Button (Wireframe Purple Button) */}
              <button
                onClick={() => {
                  setFormError(null);
                  setShowRequestModal(true);
                }}
                className="px-7 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-lg shadow-purple-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>NEW</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Leave Balance Overview Capsules (Exact Wireframe Format: Paid time Off 24 Days Available | Sick time off 07 Days Available) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Paid time Off */}
              <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-inner">
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-indigo-300">
                    Paid time Off
                  </h4>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                    24 <span className="text-xs sm:text-sm font-normal text-zinc-400">Days Available</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 text-lg">
                  🌴
                </div>
              </div>

              {/* Sick time off */}
              <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-inner">
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-emerald-300">
                    Sick time off
                  </h4>
                  <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                    07 <span className="text-xs sm:text-sm font-normal text-zinc-400">Days Available</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-lg">
                  🏥
                </div>
              </div>

            </div>

          </div>

          {/* 12-Month Calendar Grid & Public Holidays Sidebar (Exact Wireframe Matrix Layout) */}
          <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-xl">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* 12 Months Calendar Grid (3x4 Layout) */}
              <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {months2026.map((m) => {
                  // Build array of leading empty cells + month days
                  const cells: (number | null)[] = [];
                  for (let i = 0; i < m.startDay; i++) cells.push(null);
                  for (let d = 1; d <= m.days; d++) cells.push(d);

                  return (
                    <div
                      key={m.name}
                      className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between hover:border-zinc-700 transition-colors"
                    >
                      {/* Month Title */}
                      <div className="text-[12px] font-bold text-white mb-2 pb-1 border-b border-zinc-800/60 flex items-center justify-between">
                        <span>{m.name}</span>
                      </div>

                      {/* Day of Week Headers */}
                      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-zinc-500 mb-1.5">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                      </div>

                      {/* Days Matrix */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {cells.map((d, index) => {
                          if (d === null) {
                            return <div key={`empty-${m.monthIndex}-${index}`} className="h-5 w-5" />;
                          }

                          // Check if day is marked as leave or holiday
                          const isHoliday = publicHolidays.some((h) => h.month === m.monthIndex && h.day === d);
                          const isValidatedLeave = (m.monthIndex === 6 && d === 1) || (m.monthIndex === 9 && d === 24); // Demo validated leave
                          const isPendingLeave = (m.monthIndex === 4 && (d === 13 || d === 14)); // Demo to approve

                          return (
                            <div
                              key={`day-${m.monthIndex}-${d}`}
                              className={`h-5 w-5 mx-auto rounded-full text-[10px] flex items-center justify-center font-medium transition-all ${
                                isValidatedLeave
                                  ? "bg-purple-600 text-white font-bold shadow-sm"
                                  : isPendingLeave
                                  ? "bg-amber-500/30 text-amber-300 border border-amber-500/50 font-bold"
                                  : isHoliday
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                  : "text-zinc-300 hover:bg-zinc-800/60"
                              }`}
                              title={
                                isValidatedLeave
                                  ? `Validated Leave (${d} ${m.name})`
                                  : isPendingLeave
                                  ? `To Approve (${d} ${m.name})`
                                  : isHoliday
                                  ? `Public Holiday (${d} ${m.name})`
                                  : `${d} ${m.name}`
                              }
                            >
                              {d}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sidebar: Legend & Public Holidays List (Exact Wireframe Sidebar) */}
              <div className="xl:col-span-1 bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-5 space-y-6 shadow-inner h-fit">
                
                {/* Legend Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                    Legend
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-purple-600 flex-shrink-0" />
                      <span className="text-zinc-200 font-medium">Validated (Approved)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500/30 border border-amber-500/60 flex-shrink-0" />
                      <span className="text-zinc-200 font-medium">To Approve (Pending)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-600 flex-shrink-0" />
                      <span className="text-zinc-200 font-medium">Refused</span>
                    </div>
                  </div>
                </div>

                {/* Public Holidays Section (Exact List from Wireframe) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2">
                    Public Holidays (2026)
                  </h4>
                  <div className="space-y-2 text-[11px] text-zinc-300 font-sans">
                    {publicHolidays.map((h) => (
                      <div key={h.name} className="flex items-start justify-between gap-1">
                        <span className="text-zinc-400 font-mono">{h.date}</span>
                        <span className="text-white font-medium text-right">{h.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* TIME OFF TYPE REQUEST MODAL (Exact Wireframe 2 Layout)              */}
      {/* =================================================================== */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
            
            {/* Header: Time off Type Request with (X) Close */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
              <h3 className="text-xl font-serif text-white tracking-tight">
                Time off Type Request
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              
              {/* 1. Employee Field (Auto-filled) */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 text-sm">
                <span className="text-zinc-400 font-medium">Employee</span>
                <span className="font-semibold text-white">
                  [{activeUser?.name || "Alex Morgan"}]
                </span>
              </div>

              {/* 2. Time off Type Field (Select from 3 exact types) */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 text-sm">
                <span className="text-zinc-400 font-medium">Time off Type</span>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-indigo-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                >
                  <option value="Paid Time off">[Paid Time off]</option>
                  <option value="Sick Leave">[Sick Leave]</option>
                  <option value="Unpaid Leaves">[Unpaid Leaves]</option>
                </select>
              </div>

              {/* 3. Validity Period: Start Date To End Date */}
              <div className="space-y-2 py-2 border-b border-zinc-800/60">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-medium">Validity Period</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-indigo-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-500 font-medium">To</span>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-indigo-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Allocation: Computed Days */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 text-sm">
                <span className="text-zinc-400 font-medium">Allocation</span>
                <span className="font-mono font-bold text-indigo-300 text-sm">
                  {calculatedAllocationDays}
                </span>
              </div>

              {/* 5. Attachment: File Upload (For sick leave certificate) */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/60 text-sm">
                <span className="text-zinc-400 font-medium">Attachment:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAttachedFileName(file.name);
                        toast.success(`Attached: ${file.name}`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer flex items-center justify-center"
                    title="Upload certificate"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <span className="text-xs text-zinc-400 italic">
                    {attachedFileName ? attachedFileName : "(For sick leave certificate)"}
                  </span>
                </div>
              </div>

              {/* Action Buttons: [ Submit ] & [ Discard ] */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all active:scale-95 shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRequestModal(false);
                    setAttachedFileName(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Discard
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
