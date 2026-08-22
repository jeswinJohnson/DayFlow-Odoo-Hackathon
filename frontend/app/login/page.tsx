"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
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
      const resp = await login(identifier, password);
      if (!resp) {
        setLoading(false);
        return;
      }
      toast.success("Successfully logged in!");
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Failed to sign in. Please check your credentials.");
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

  // 1. Password Recovery Mode (Triggered via email reset link)
  if (isRecoveryMode) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1">
              Password Recovery Mode
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Set New Password</h2>
            <p className="text-zinc-400 text-sm">Please choose a new secure password for your account.</p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update & Sign In"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsRecoveryMode(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Forgot Password Request Mode
  if (isForgotView) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
            <p className="text-zinc-400 text-sm">
              Enter your <span className="text-zinc-200">User ID</span> or <span className="text-zinc-200">Email</span> to receive reset instructions.
            </p>
          </div>

          <form onSubmit={handleResetRequest} className="space-y-5">
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                User ID / Email
              </label>
              <input
                type="text"
                required
                value={resetIdentifier}
                onChange={(e) => setResetIdentifier(e.target.value)}
                placeholder="e.g. USR-102 or alex@company.com"
                className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsForgotView(false)}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Standard Login View
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden">
      {/* Dynamic ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-2">
            Authentication Required
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">
            Sign in with your <span className="text-zinc-200 font-medium">User ID</span> or <span className="text-zinc-200 font-medium">Email</span>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* User ID or Email */}
          <div className="space-y-2 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
              User ID / Email
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. USR-102 or alex@company.com"
                className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotView(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-14 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-1.5 py-1 rounded focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-800/80 text-center">
          <p className="text-xs text-zinc-500">
            Protected endpoint area. Access restricted to authorized users.
          </p>
        </div>
      </div>
    </div>
  );
}

