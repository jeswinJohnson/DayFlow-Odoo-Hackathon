"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components";
import { TestResult } from "@/types";

export default function Home() {
  const { test, isLoading, error } = useApp();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleTestClick = async () => {
    const res = await test();
    if (res.success && res.data) {
      setTestResult(res.data);
      setMessage(res.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-950 text-zinc-100 font-sans p-6">
      <main className="max-w-xl w-full">
        <Card className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Boilerplate Architecture
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              DayFlow App
            </h1>
            <p className="text-zinc-400 text-sm">
              Connected with{" "}
              <code className="text-indigo-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-xs">
                AppContext
              </code>{" "}
              &amp; centralized TypeScript definitions.
            </p>
          </div>

          {/* Action Button & Test Function Demo */}
          <div className="w-full flex flex-col items-center gap-4 border-t border-b border-zinc-800/80 py-6">
            <button
              onClick={handleTestClick}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Executing test()...
                </>
              ) : (
                "Run test() API Function"
              )}
            </button>

            {error && (
              <div className="w-full p-4 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-300 text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            {testResult && (
              <div className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold uppercase tracking-wide">
                  <span>API Status</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
                <p className="text-xs text-zinc-400">{message}</p>
                <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <pre>{JSON.stringify(testResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <a
              href="/test-404-page"
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium text-center transition-colors border border-zinc-700/50"
            >
              Test 404 Catch-All Page
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
}
