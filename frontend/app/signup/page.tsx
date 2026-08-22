"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Please enter your company name.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            name: name.trim(),
            company_name: companyName.trim(),
            phone: phone.trim(),
            avatar_url: logoPreview || null,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Try inserting into users table if table exists
      if (data?.user?.id) {
        try {
          await supabase.from("users").upsert({
            id: data.user.id,
            email: email.trim(),
            name: name.trim(),
            company_name: companyName.trim(),
            phone: phone.trim(),
          });
        } catch (dbErr) {
          console.warn("Notice: users table sync:", dbErr);
        }
      }

      if (data?.session) {
        toast.success("Account created successfully! Welcome to DayFlow.");
        router.push("/");
      } else {
        toast.success("Account created! Please check your email to confirm your account or sign in.");
        router.push("/login");
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      toast.error(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 md:p-8">
      <div className="w-full max-w-6xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col md:flex-row min-h-[660px] p-2.5">

        {/* Left Content Area */}
        <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between">
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

            <div className="space-y-1.5 mb-6">
              <h1 className="text-4xl md:text-5xl font-serif text-white tracking-tight">
                Sign Up
              </h1>
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mt-2">
                Create your account and start managing your company workspace.
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Company Name & Logo Upload */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Company Name
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full px-4 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  />

                  {/* Upload Logo Trigger */}
                  {/* <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Company Logo"
                    className="flex-shrink-0 p-2.5 rounded-xl bg-zinc-950/90 hover:bg-zinc-800 border border-zinc-800 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-5 h-5 rounded object-cover" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )}
                  </button> */}
                </div>
              </div>

              {/* Full Name & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-4 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs font-medium p-1 rounded focus:outline-none cursor-pointer"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-2.5 bg-zinc-950/90 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 text-xs font-medium p-1 rounded focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Switch to Sign In link */}
          <div className="pt-6 text-center">
            <p className="text-zinc-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Abstract Art Area */}
        <div className="hidden md:block md:w-1/2 relative p-2.5">
          <div
            className="w-full h-full min-h-[560px] rounded-2xl overflow-hidden relative shadow-inner"
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

      </div>
    </main>
  );
}
