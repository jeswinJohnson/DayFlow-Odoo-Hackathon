import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6 text-center">
      <div className="relative max-w-lg w-full bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
        <div className="relative">
          <span className="text-8xl font-black tracking-tighter text-zinc-800 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-4 py-1.5 rounded-full border border-indigo-800/50 shadow-inner">
              Page Not Found
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Looking for something?
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            The page you requested could not be found or has been moved to a new route.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
