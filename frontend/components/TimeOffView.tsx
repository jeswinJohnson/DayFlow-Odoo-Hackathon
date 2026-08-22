"use client";

import { useState } from "react";
import { MockTimeOff } from "@/data/mockData";
import toast from "react-hot-toast";

interface TimeOffViewProps {
  requests: MockTimeOff[];
  onRequestTimeOff: (newRequest: MockTimeOff) => void;
}

export function TimeOffView({ requests, onRequestTimeOff }: TimeOffViewProps) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveType, setLeaveType] = useState<MockTimeOff["type"]>("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.error("Please specify both start and end dates.");
      return;
    }

    const payload: MockTimeOff = {
      id: `TO-${Date.now()}`,
      employeeId: "CURRENT-USER",
      employeeName: "Alex Morgan (You)",
      type: leaveType,
      startDate,
      endDate,
      days: 3,
      status: "pending",
      reason: reason || "Requested time off",
    };

    onRequestTimeOff(payload);
    toast.success("Time off request submitted successfully!");
    setShowRequestModal(false);
    setReason("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Leave Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span>Annual Leave</span>
            <span>🌴</span>
          </div>
          <p className="text-3xl font-bold text-white">18 <span className="text-sm font-normal text-zinc-400">Days Left</span></p>
          <p className="text-xs text-zinc-500">Allocated: 24 days / year</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <span>Sick Leave</span>
            <span>🏥</span>
          </div>
          <p className="text-3xl font-bold text-white">10 <span className="text-sm font-normal text-zinc-400">Days Left</span></p>
          <p className="text-xs text-zinc-500">Allocated: 12 days / year</p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-purple-400">
            <span>Personal Days</span>
            <span>✨</span>
          </div>
          <p className="text-3xl font-bold text-white">4 <span className="text-sm font-normal text-zinc-400">Days Left</span></p>
          <p className="text-xs text-zinc-500">Allocated: 5 days / year</p>
        </div>
      </div>

      {/* Requests Header & Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif text-white">Time Off Requests</h3>
          <p className="text-xs text-zinc-400">View and manage leave applications</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 active:scale-[0.99] shadow-sm flex items-center gap-2 cursor-pointer select-none"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Request Leave</span>
        </button>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {req.type}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  req.status === "approved"
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                    : req.status === "pending"
                    ? "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                    : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                }`}
              >
                {req.status}
              </span>
            </div>

            <div>
              <h4 className="font-semibold text-white text-sm">{req.employeeName}</h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {req.startDate} — {req.endDate} ({req.days} days)
              </p>
            </div>

            {req.reason && (
              <p className="text-xs text-zinc-500 italic bg-zinc-950/50 p-2.5 rounded-xl border border-zinc-800/50">
                "{req.reason}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Leave Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-xl font-serif text-white">Request Time Off</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Leave Type
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal">Personal Day</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Reason / Notes
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide context for your manager..."
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all active:scale-95 shadow-md"
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
