"use client";

import { MockAttendance } from "@/data/mockData";

interface AttendanceViewProps {
  records: MockAttendance[];
  isCheckedIn: boolean;
  checkInTime: string | null;
  onToggleCheckIn: () => void;
}

export function AttendanceView({
  records,
  isCheckedIn,
  checkInTime,
  onToggleCheckIn,
}: AttendanceViewProps) {
  return (
    <div className="w-full space-y-6">
      
      {/* Attendance Hero Banner */}
      <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Systray Attendance Sync
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
            Daily Attendance & Work Hours
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-lg">
            Track live check-in and check-out timestamps, recorded presence, and work duration logs.
          </p>
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onToggleCheckIn}
          className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.99] shadow-sm flex items-center gap-2 cursor-pointer select-none flex-shrink-0 ${
            isCheckedIn
              ? "bg-rose-600 hover:bg-rose-500 text-white"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          {isCheckedIn ? "Check Out Now →" : "Check IN Now →"}
        </button>
      </div>

      {/* Attendance Records Table */}
      <div className="w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-semibold text-white text-base">Recent Attendance Logs</h3>
          <span className="text-xs text-zinc-400 font-mono">
            {records.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950/50 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Check In</th>
                <th className="px-6 py-3.5">Check Out</th>
                <th className="px-6 py-3.5">Work Duration</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {records.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {log.employeeName}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">
                    {log.date}
                  </td>
                  <td className="px-6 py-4 font-mono text-emerald-400 whitespace-nowrap">
                    {log.checkIn}
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-400 whitespace-nowrap">
                    {log.checkOut || "— (Active)"}
                  </td>
                  <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                    {log.workHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === "on_time"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                          : "bg-amber-950/80 text-amber-400 border border-amber-800/60"
                      }`}
                    >
                      {log.status === "on_time" ? "On Time" : "Late Arrival"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
