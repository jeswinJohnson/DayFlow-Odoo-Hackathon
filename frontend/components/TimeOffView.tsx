"use client";

import { useState, useMemo } from "react";
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

  // Sub-Navigation: "time_off" | "allocation"
  const [subTab, setSubTab] = useState<"time_off" | "allocation">("time_off");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Validation State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveType, setLeaveType] = useState<string>("Paid Time off");
  const [startDate, setStartDate] = useState("2025-10-28");
  const [endDate, setEndDate] = useState("2025-10-28");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Local Requests State using the exact 3 specified TimeOff Types
  const [localRequests, setLocalRequests] = useState<MockTimeOff[]>([
    {
      id: "TO-301",
      employeeId: "EMP-001",
      employeeName: "Alex Morgan",
      type: "Paid Time off" as any,
      startDate: "28/10/2025",
      endDate: "28/10/2025",
      days: 1,
      status: "pending",
      reason: "Personal appointment",
    },
    {
      id: "TO-302",
      employeeId: "EMP-002",
      employeeName: "Sarah Chen",
      type: "Sick Leave" as any,
      startDate: "29/10/2025",
      endDate: "30/10/2025",
      days: 2,
      status: "pending",
      reason: "Medical appointment & recovery",
    },
    {
      id: "TO-303",
      employeeId: "EMP-004",
      employeeName: "Elena Rostova",
      type: "Paid Time off" as any,
      startDate: "24/10/2025",
      endDate: "25/10/2025",
      days: 2,
      status: "approved",
      reason: "Family event travel",
    },
    {
      id: "TO-304",
      employeeId: "EMP-006",
      employeeName: "Olivia Thorne",
      type: "Unpaid Leaves" as any,
      startDate: "18/10/2025",
      endDate: "18/10/2025",
      days: 1,
      status: "approved",
      reason: "Personal commitment",
    },
    ...requests.map((r) => ({
      ...r,
      startDate: r.startDate.includes("/") ? r.startDate : "28/10/2025",
      endDate: r.endDate.includes("/") ? r.endDate : "28/10/2025",
      type: (r.type === "Annual Leave" ? "Paid Time off" : r.type === "Sick Leave" ? "Sick Leave" : "Unpaid Leaves") as any,
    })),
  ]);

  // Handle Approve
  const handleApprove = (id: string, name: string) => {
    setLocalRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );
    if (onApproveRequest) onApproveRequest(id);
    toast.success(`Approved time off for ${name}`);
  };

  // Handle Reject
  const handleReject = (id: string, name: string) => {
    setLocalRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" } : item))
    );
    if (onRejectRequest) onRejectRequest(id);
    toast.error(`Rejected time off request for ${name}`);
  };

  // Handle Submit Application with strict validation
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

    if (!reason.trim()) {
      setFormError("Reason is required to apply for time off.");
      toast.error("Please enter a reason for your time off request.");
      return;
    }

    // Format to DD/MM/YYYY
    const formatToDDMMYYYY = (iso: string) => {
      const parts = iso.split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return iso;
    };

    const formattedStart = formatToDDMMYYYY(startDate);
    const formattedEnd = formatToDDMMYYYY(endDate);

    const newReq: MockTimeOff = {
      id: `TO-${Date.now()}`,
      employeeId: activeUser?.id || "EMP-001",
      employeeName: activeUser?.name || "Alex Morgan",
      type: leaveType as any,
      startDate: formattedStart,
      endDate: formattedEnd,
      days: 1,
      status: "pending",
      reason: reason.trim(),
    };

    setLocalRequests((prev) => [newReq, ...prev]);
    onRequestTimeOff(newReq);
    toast.success("Time off request submitted for review!");
    setShowRequestModal(false);
    setReason("");
    setFormError(null);
  };

  // Filter requests by role: Employees see only their own requests, Admins see all
  const filteredByRole = useMemo(() => {
    if (isAdmin) return localRequests;
    return localRequests.filter(
      (r) =>
        r.employeeId === (activeUser?.id || "EMP-001") ||
        r.employeeName.toLowerCase().includes(activeUser?.name?.toLowerCase() || "alex")
    );
  }, [localRequests, isAdmin, activeUser]);

  // Search Filter
  const finalFilteredRequests = useMemo(() => {
    return filteredByRole.filter((r) => {
      const matchSearch =
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.startDate.includes(searchQuery) ||
        r.endDate.includes(searchQuery);
      return matchSearch;
    });
  }, [filteredByRole, searchQuery]);

  return (
    <div className="w-full space-y-6 text-left">
      
      {/* Top Container matching Wireframe */}
      <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        
        {/* Header Bar with Sub-Tabs: [ Time Off ] | [ Allocation ] */}
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

        {/* SUB-TAB 1: TIME OFF (Matching Wireframe Action Bar, Balance Capsules & Table) */}
        {subTab === "time_off" && (
          <div className="space-y-5 animate-in fade-in duration-150">
            
            {/* Action Row: [ NEW ] Button + Bigger Searchbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              {/* [ NEW ] Request Button (Flat prominent button from wireframe) */}
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

              {/* Bigger Searchbar */}
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
        )}

        {/* SUB-TAB 2: ALLOCATION QUOTA OVERVIEW */}
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

      {/* Time Off Table (Full Width - Note Card Removed) */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
        
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono font-medium">
            Time Off Records Table
          </span>
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
                    
                    {/* Name Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex-shrink-0">
                          <img src={avatar} alt={row.employeeName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {row.employeeName}
                          </div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {row.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Start Date */}
                    <td className="px-6 py-4 font-mono whitespace-nowrap text-zinc-200">
                      {row.startDate}
                    </td>

                    {/* End Date */}
                    <td className="px-6 py-4 font-mono whitespace-nowrap text-zinc-200">
                      {row.endDate}
                    </td>

                    {/* Time off Type (Exact 3 Types) */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-300">
                      {row.type}
                    </td>

                    {/* Status / Reject & Approve Buttons for Admin */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {row.status === "pending" && isAdmin ? (
                        <div className="flex items-center justify-center gap-2">
                          {/* Reject Button (Rose) */}
                          <button
                            onClick={() => handleReject(row.id, row.employeeName)}
                            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800/70 text-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                            title="Reject Request"
                          >
                            <span>❌</span>
                            <span className="hidden sm:inline">Reject</span>
                          </button>

                          {/* Approve Button (Emerald) */}
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
                              : row.status === "rejected"
                              ? "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                              : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                          }`}
                        >
                          {row.status === "approved"
                            ? "Approved"
                            : row.status === "rejected"
                            ? "Rejected"
                            : "Pending Review"}
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-950/60 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <span>DayFlow Time Off Management</span>
          <span>{subTab === "time_off" ? "Active Records" : "Allocation Overview"}</span>
        </div>

      </div>

      {/* Leave Application Request Modal (Triggered by [ NEW ] Button) */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌴</span>
                <h3 className="text-xl font-serif text-white">Create Time Off Request</h3>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
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
              
              {/* Time off Type (Exact 3 Options from User) */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Time off Type <span className="text-rose-400">*</span>
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Paid Time off">Paid Time off</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leaves">Unpaid Leaves</option>
                </select>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Start Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    End Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Reason / Notes (Strictly Validated & Required) */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Provide a mandatory reason for your time off request..."
                  className={`w-full px-4 py-2.5 bg-zinc-950 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder:text-zinc-600 resize-none ${
                    formError && !reason.trim() ? "border-rose-500" : "border-zinc-800"
                  }`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all active:scale-95 shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Submit Application
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
