"use client";

import { MockEmployee } from "@/data/mockData";

interface EmployeeCardProps {
  employee: MockEmployee;
  onSelect: (employee: MockEmployee) => void;
}

export function EmployeeCard({ employee, onSelect }: EmployeeCardProps) {
  // Render status badge at top-right corner based on wireframe specifications
  const renderStatusBadge = () => {
    switch (employee.status) {
      case "present":
        return (
          <div 
            title="Present in office"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
            <span className="hidden sm:inline">Present</span>
          </div>
        );
      case "on_leave":
        return (
          <div 
            title="On Leave"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-[11px] font-semibold"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline">On Leave</span>
          </div>
        );
      case "absent":
        return (
          <div 
            title="Absent"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="hidden sm:inline">Absent</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onSelect(employee)}
      className="group relative bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700 backdrop-blur-xl rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20 cursor-pointer flex flex-col justify-between gap-4 select-none active:scale-[0.99]"
    >
      {/* Top Card Header: Avatar & Top-Right Status Badge */}
      <div className="flex items-start justify-between gap-3">
        
        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shadow-md">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback placeholder image
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          {/* Mini department badge */}
          <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-zinc-950/90 border border-zinc-800 rounded-md text-zinc-300">
            {employee.department.substring(0, 3)}
          </span>
        </div>

        {/* Top-Right Status Indicator (Green dot / Airplane / Yellow dot) */}
        <div>{renderStatusBadge()}</div>
      </div>

      {/* Employee Details Info */}
      <div className="space-y-1 text-left">
        <h3 className="font-semibold text-white text-base sm:text-lg group-hover:text-indigo-300 transition-colors truncate">
          {employee.name}
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm truncate">
          {employee.role}
        </p>
        <p className="text-zinc-500 text-[11px] font-medium truncate pt-1">
          {employee.department}
        </p>
      </div>

      {/* Card Bottom Meta */}
      <div className="border-t border-zinc-800/60 pt-3 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="truncate max-w-[140px] text-zinc-500" title={employee.email}>
          {employee.email}
        </span>
        <span className="text-indigo-400/90 group-hover:translate-x-0.5 transition-transform font-medium flex items-center gap-1">
          View
          <span>→</span>
        </span>
      </div>
    </div>
  );
}
