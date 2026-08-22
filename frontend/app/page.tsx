"use client";

import { useApp } from "@/context/AppContext";
import { Card } from "@/components";

export default function Home() {
  const { activeUser, logout } = useApp();

  console.log(activeUser)

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-950 text-zinc-100 font-sans p-6 min-h-screen">
      <main className="max-w-xl w-full">
        <Card className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Authenticated & Protected
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              DayFlow Dashboard
            </h1>
            <p className="text-zinc-400 text-sm">
              Welcome back to your protected application space.
            </p>
          </div>

          {/* User Profile Card */}
          <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <span className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                User Profile
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">User ID / ID:</span>
                <span className="text-white font-mono text-xs bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {activeUser?.uid || activeUser?.id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Email:</span>
                <span className="text-white font-medium">{activeUser?.email || "N/A"}</span>
              </div>
              {activeUser?.name && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Name:</span>
                  <span className="text-white font-medium">{activeUser.name}</span>
                </div>
              )}
              {activeUser?.department_name && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Department:</span>
                  <span className="text-white font-medium">{activeUser.department_name}</span>
                </div>
              )}
              {activeUser?.role && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Role:</span>
                  <span className="text-indigo-400 font-medium capitalize">{activeUser.role}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="w-full pt-2">
            <button
              onClick={() => logout()}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 font-medium text-sm rounded-xl border border-zinc-800 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </Card>
      </main>
    </div>
  );
}

