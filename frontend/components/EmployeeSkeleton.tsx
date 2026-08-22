"use client";

interface EmployeeSkeletonProps {
  count?: number;
}

export function EmployeeSkeleton({ count = 6 }: EmployeeSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 animate-pulse select-none"
        >
          {/* Header Skeleton: Avatar & Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-800 border border-zinc-700/60" />
            <div className="w-20 h-6 rounded-full bg-zinc-800/80" />
          </div>

          {/* Details Skeleton: Name, Designation, Department */}
          <div className="space-y-2 text-left pt-1">
            <div className="h-5 w-3/4 bg-zinc-800 rounded-md" />
            <div className="h-4 w-1/2 bg-zinc-800/60 rounded-md" />
            <div className="h-3 w-1/3 bg-zinc-800/40 rounded-md pt-1" />
          </div>

          {/* Bottom Card Meta Skeleton: Email & View button */}
          <div className="border-t border-zinc-800/60 pt-3 flex items-center justify-between">
            <div className="h-3 w-28 bg-zinc-800/50 rounded-md" />
            <div className="h-3 w-12 bg-zinc-800/60 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
