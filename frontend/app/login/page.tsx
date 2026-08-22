"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login, isRecoveryMode, resetPassword, updatePassword, setIsRecoveryMode } = useApp();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [resetIdentifier, setResetIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotView, setIsForgotView] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error("Please enter your User ID or Email.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      await login(identifier, password);
      toast.success("Successfully logged in!");
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim()) {
      toast.error("Please enter your User ID or Email.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(resetIdentifier);
      toast.success("Password reset instructions sent to your email!");
      setIsForgotView(false);
      setResetIdentifier("");
    } catch (err: any) {
      console.error("Reset error:", err);
      toast.error(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(newPassword);
      toast.success("Password updated successfully! Redirecting...");
      router.push("/");
    } catch (err: any) {
      console.error("Update password error:", err);
      toast.error(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Right-Side Abstract Art Component
  const RightSideArt = () => (
    <div className="hidden md:block md:w-1/2 relative p-2.5">
      <div 
        className="w-full h-full min-h-[520px] rounded-2xl overflow-hidden relative shadow-inner"
        style={{ backgroundColor: '#f3ebd9' }}
      >
        {/* Top Right Golden / Amber Swirl */}
        <div 
          className="absolute -top-[15%] -right-[15%] w-[85%] h-[80%] rounded-full opacity-90 filter blur-[75px]"
          style={{ background: 'radial-gradient(circle, #e5ae52 0%, #dca042 60%, transparent 80%)' }}
        />

        {/* Bottom Right Warm Honey Swirl */}
        <div 
          className="absolute -bottom-[20%] right-[0%] w-[90%] h-[85%] rounded-full opacity-90 filter blur-[85px]"
          style={{ background: 'radial-gradient(circle, #e2aa4e 0%, #ce9338 60%, transparent 80%)' }}
        />

        {/* Top Left Warm Tint */}
        <div 
          className="absolute -top-[10%] left-[5%] w-[55%] h-[55%] rounded-full opacity-75 filter blur-[65px]"
          style={{ background: 'radial-gradient(circle, #f0ca7b 0%, #e8bc68 50%, transparent 75%)' }}
        />

        {/* Vibrant Cobalt / Azure Blue S-Curve Wave (Center-Left) */}
        <div 
          className="absolute top-[18%] left-[10%] w-[50%] h-[55%] rounded-[45%_55%_65%_35%/50%_60%_40%_50%] opacity-95 filter blur-[60px] -rotate-12"
          style={{ background: 'linear-gradient(145deg, #1d4ed8 0%, #2563eb 45%, #60a5fa 90%)' }}
        />

        {/* Bottom-Left Blue Tail Extension */}
        <div 
          className="absolute bottom-[2%] -left-[10%] w-[35%] h-[40%] rounded-full opacity-80 filter blur-[55px]"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, #3b82f6 50%, transparent 80%)' }}
        />

        {/* Soft Cream Highlight in Center */}
        <div 
          className="absolute top-[40%] left-[30%] w-[45%] h-[45%] rounded-full opacity-60 filter blur-[50px]"
          style={{ background: '#fbf7ee' }}
        />

        {/* Sand / Film Grain Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.42] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sandGrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sandGrain)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>
    </div>
  );

  // 1. Password Recovery Mode (Triggered via email reset link)
  if (isRecoveryMode) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 md:p-8">
        <div className="w-full max-w-6xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row min-h-[600px] p-2.5">
          
          {/* Left Content Area */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between">
            {/* Prominent Fluid Abstract Logo & Company Header */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex items-center justify-center p-2 relative overflow-hidden flex-shrink-0">
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500/30 rounded-full blur-md" />
                <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-blue-600/40 rounded-full blur-md" />
                <svg className="w-7 h-7 relative z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10C10 6 16 14 20 10C23 7 25 8 26 9.5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M6 16C11 11 17 21 22 16C24.5 13.5 26 14.5 26 16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  <path d="M6 22C10 18 16 26 21 22.5C23.5 20.5 25.5 21.5 26 22.5" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-white tracking-tight text-3xl font-sans">
                DayFlow
              </span>
            </div>

            <div className="space-y-6 my-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                Password Recovery
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                Set New Password
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                Please choose a new secure password for your account.
              </p>

              <form onSubmit={handlePasswordUpdate} className="space-y-5 pt-2">
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Updating Password...
                      </span>
                    ) : (
                      "Update & Sign In"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={() => setIsRecoveryMode(false)}
                className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>

          <RightSideArt />
        </div>
      </main>
    );
  }

  // 2. Forgot Password Request Mode
  if (isForgotView) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 md:p-8">
        <div className="w-full max-w-6xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row min-h-[600px] p-2.5">
          
          {/* Left Content Area */}
          <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between">
            {/* Prominent Fluid Abstract Logo & Company Header */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex items-center justify-center p-2 relative overflow-hidden flex-shrink-0">
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500/30 rounded-full blur-md" />
                <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-blue-600/40 rounded-full blur-md" />
                <svg className="w-7 h-7 relative z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10C10 6 16 14 20 10C23 7 25 8 26 9.5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M6 16C11 11 17 21 22 16C24.5 13.5 26 14.5 26 16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  <path d="M6 22C10 18 16 26 21 22.5C23.5 20.5 25.5 21.5 26 22.5" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-white tracking-tight text-3xl font-sans">
                DayFlow
              </span>
            </div>

            <div className="space-y-6 my-auto">
              <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                Reset Password
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm">
                Enter your <span className="text-zinc-200">User ID</span> or <span className="text-zinc-200">Email</span> to receive reset instructions.
              </p>

              <form onSubmit={handleResetRequest} className="space-y-5 pt-2">
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    User ID or Email
                  </label>
                  <input
                    type="text"
                    required
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="Enter your user ID or email"
                    className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending Link...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={() => setIsForgotView(false)}
                className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </div>

          <RightSideArt />
        </div>
      </main>
    );
  }

  // 3. Standard Login View (Matching reference layout and 404 page styling)
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row min-h-[600px] p-2.5">
        
        {/* Left Content Area */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-between">
          <div>
            {/* Prominent Fluid Abstract Logo & Company Header */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl flex items-center justify-center p-2 relative overflow-hidden flex-shrink-0">
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500/30 rounded-full blur-md" />
                <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-blue-600/40 rounded-full blur-md" />
                <svg className="w-7 h-7 relative z-10" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10C10 6 16 14 20 10C23 7 25 8 26 9.5" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M6 16C11 11 17 21 22 16C24.5 13.5 26 14.5 26 16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                  <path d="M6 22C10 18 16 26 21 22.5C23.5 20.5 25.5 21.5 26 22.5" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-white tracking-tight text-3xl font-sans">
                DayFlow
              </span>
            </div>

            <div className="space-y-6 my-auto">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                  Sign In
                </h1>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mt-2">
                  Sign in with your <span className="text-zinc-200 font-medium">User ID</span> or <span className="text-zinc-200 font-medium">Email</span> to access your dashboard.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5 pt-2">
                {/* User ID or Email */}
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Email Address or User ID
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your email or user ID"
                    className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-4 pr-14 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-1.5 py-1 rounded focus:outline-none cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* Forgot Password Link below password input */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsForgotView(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {/* Submit Button (Full Width, flat, no halo) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Switch to Sign Up link */}
          <div className="pt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Abstract Art Area */}
        <RightSideArt />

      </div>
    </main>
  );
}


