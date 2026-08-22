"use client";

import { DEPARTMENTS } from "@/data/mockData";

interface ActionBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  onNewEmployee: () => void;
  employeeStats: {
    total: number;
    present: number;
    onLeave: number;
    absent: number;
  };
}

export function ActionBar({
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment,
  onNewEmployee,
  employeeStats,
}: ActionBarProps) {
  return (
    <div className="w-full space-y-4 mb-6">
      
      {/* Top Action Row (Exact Wireframe Spec) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Left: NEW Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewEmployee}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 active:scale-[0.99] flex items-center gap-2 shadow-sm cursor-pointer select-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="tracking-wide">NEW</span>
          </button>

          {/* Live Quick Metrics (Upgraded Premium Segmented Bar) */}
          <div className="hidden lg:flex items-center gap-2.5 bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl px-3.5 py-1.5 rounded-2xl shadow-sm">
            {/* Total Count */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300">
              <span className="text-zinc-400 font-medium">Total:</span>
              <span className="font-bold text-white font-mono">{employeeStats.total}</span>
            </div>

            {/* Present Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
              <span>{employeeStats.present}</span>
              <span className="font-normal text-emerald-400/90">Present</span>
            </div>

            {/* On Leave Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>{employeeStats.onLeave}</span>
              <span className="font-normal text-sky-400/90">On Leave</span>
            </div>

            {/* Absent Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span>{employeeStats.absent}</span>
              <span className="font-normal text-amber-400/90">Absent</span>
            </div>
          </div>
        </div>

        {/* Right: Search Input */}
        <div className="relative flex-1 sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search employee by name, role, department..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

      </div>

      {/* Department Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDepartment === dept;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-zinc-100 text-zinc-900 font-semibold shadow-sm"
                  : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>

    </div>
  );
}
