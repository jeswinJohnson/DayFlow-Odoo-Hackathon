"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DashboardHeader } from "@/components";
import toast from "react-hot-toast";

export default function EmployeeProfilePage() {
  const { activeUser } = useApp();

  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<"employees" | "attendance" | "time_off">("employees");
  const [profileTab, setProfileTab] = useState<"resume" | "private_info" | "salary_info" | "security">("private_info");

  // Systray State
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>("08:45 AM");

  // Profile Header State (from Employee Wireframe - Strict View Only)
  const [name] = useState(activeUser?.name || "Alex Morgan");
  const [jobPosition] = useState(activeUser?.department_name ? `Senior ${activeUser.department_name} Engineer` : "Senior Frontend Engineer");
  const [email] = useState(activeUser?.email || "alex.morgan@dayflow.internal");
  const [mobile] = useState("+1 (555) 234-5678");
  const [company] = useState("DayFlow Technologies Inc.");
  const [department] = useState(activeUser?.department_name || "Engineering");
  const [manager] = useState("Elena Rostova (VP of People)");
  const [location] = useState("Floor 4 - Tech Bay A, San Francisco HQ");
  const [avatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  );

  // Private Info Tab State (Exact fields from Employee Wireframe - Strict View Only)
  const [dob] = useState("14 Oct 1996");
  const [address] = useState("124 Market Street, Suite 400, San Francisco, CA 94103");
  const [nationality] = useState("United States");
  const [personalEmail] = useState("alex.personal@example.com");
  const [gender] = useState("Female");
  const [maritalStatus] = useState("Single");
  const [doj] = useState("12 Jan 2023");

  // Bank & Statutory Identification Details (from Employee Wireframe - Strict View Only)
  const [accountNumber] = useState("•••• •••• 9821");
  const [bankName] = useState("Silicon Valley Bank");
  const [ifscCode] = useState("SVB0004521");
  const [panNo] = useState("ABCDE1234F");
  const [uanNo] = useState("100987654321");
  const [empCode] = useState("DF-EMP-204");

  // Resume Tab Content (Strict View Only)
  const [aboutText] = useState(
    "Lead frontend architect specializing in high-performance web applications, responsive user interfaces, and state-of-the-art interactive component design."
  );

  const [jobLoveText] = useState(
    "Designing elegant user interfaces, crafting smooth micro-interactions, and building resilient systems that empower people to do their best work."
  );

  const [hobbiesText] = useState(
    "Open-source tooling, mechanical keyboards, landscape photography, hiking, and coffee brewing."
  );

  // Skills State (Strict View Only)
  const [skills] = useState<string[]>([
    "React / Next.js",
    "TypeScript",
    "TailwindCSS",
    "GraphQL",
    "System Architecture",
    "UI/UX Prototyping",
  ]);

  // Certifications State (Strict View Only)
  const [certifications] = useState<
    { name: string; issuer: string; year: string }[]
  >([
    { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", year: "2024" },
    { name: "Certified Frontend Specialist", issuer: "Frontend Masters", year: "2023" },
  ]);

  // Toggle Check In / Out
  const handleToggleCheckIn = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckInTime(null);
      toast("Checked OUT successfully.", { icon: "👋" });
    } else {
      const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setIsCheckedIn(true);
      setCheckInTime(nowTime);
      toast.success(`Checked IN at ${nowTime}!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Top Header Bar */}
      <DashboardHeader
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        isCheckedIn={isCheckedIn}
        checkInTime={checkInTime}
        onToggleCheckIn={handleToggleCheckIn}
        onOpenMyProfile={() => {}}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Title Bar & Back Navigation (Exact Wireframe Architecture) */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Back to Dashboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              My Profile
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              Employee View
            </span>
          </div>
        </div>

        {/* Hero Profile Info Card (Exact Employee Wireframe Layout - View Only) */}
        <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            
            {/* Avatar (Strict View Only, No Edit Pencil Button) */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover select-none"
                />
              </div>
            </div>

            {/* Profile Metadata (Dual Column Layout from Wireframe - View Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full text-left">
              
              {/* Left Column: My Name, Job Position, Email, Mobile */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    {name}
                  </h2>
                  <p className="text-xs text-indigo-400 font-medium mt-0.5">
                    {jobPosition}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium w-16">Email:</span>
                    <a href={`mailto:${email}`} className="text-white hover:text-indigo-400 transition-colors font-medium">
                      {email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium w-16">Mobile:</span>
                    <span className="text-zinc-200 font-mono">{mobile}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Company, Department, Manager, Location */}
              <div className="space-y-2 text-xs sm:text-sm bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/60">
                <div className="flex justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-zinc-400 font-medium">Company:</span>
                  <span className="text-white font-medium">{company}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-zinc-400 font-medium">Department:</span>
                  <span className="text-indigo-300 font-semibold">{department}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-zinc-800/40">
                  <span className="text-zinc-400 font-medium">Manager:</span>
                  <span className="text-zinc-200 font-medium">{manager}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-zinc-400 font-medium">Location:</span>
                  <span className="text-zinc-200 font-medium text-right">{location}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Profile Sub-Tabs (Resume | Private Info | Salary Info | Security) */}
        <div className="border-b border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setProfileTab("resume")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                profileTab === "resume"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Resume
            </button>

            <button
              onClick={() => setProfileTab("private_info")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                profileTab === "private_info"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Private Info
            </button>

            <button
              onClick={() => setProfileTab("salary_info")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                profileTab === "salary_info"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Salary Info
            </button>

            <button
              onClick={() => setProfileTab("security")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                profileTab === "security"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: RESUME (Strict View Only)                                    */}
        {/* =================================================================== */}
        {profileTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            
            {/* Left Column: About & Stories (7 cols - View Only) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* About */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-3 text-left">
                <div className="border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">About</h3>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {aboutText}
                </p>
              </div>

              {/* What I love about my job */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-3 text-left">
                <div className="border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">What I love about my job</h3>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {jobLoveText}
                </p>
              </div>

              {/* My interests and hobbies */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-3 text-left">
                <div className="border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">My interests and hobbies</h3>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {hobbiesText}
                </p>
              </div>

            </div>

            {/* Right Column: Skills & Certifications (5 cols - View Only) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Skills */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4 text-left">
                <div className="border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">Skills</h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certification */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4 text-left">
                <div className="border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">Certification</h3>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-white">{cert.name}</h4>
                        <p className="text-[11px] text-zinc-400">{cert.issuer}</p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 rounded-md">
                        {cert.year}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: PRIVATE INFO (Exact Wireframe Specification - View Only)     */}
        {/* =================================================================== */}
        {profileTab === "private_info" && (
          <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-150">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Personal Information */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white border-b border-zinc-800 pb-2">
                  Personal Information
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Date of Birth:</span>
                    <span className="text-white font-medium">{dob}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Residing Address:</span>
                    <span className="text-white font-medium text-right max-w-[260px]">{address}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Nationality:</span>
                    <span className="text-white font-medium">{nationality}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Personal Email:</span>
                    <a href={`mailto:${personalEmail}`} className="text-indigo-400 hover:underline font-medium">
                      {personalEmail}
                    </a>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Gender:</span>
                    <span className="text-white font-medium">{gender}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Marital Status:</span>
                    <span className="text-white font-medium">{maritalStatus}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400 font-medium">Date of Joining:</span>
                    <span className="text-emerald-400 font-semibold">{doj}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Bank Details & Statutory IDs (from Wireframe) */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white border-b border-zinc-800 pb-2">
                  Bank Details & Identifications
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Account Number:</span>
                    <span className="text-white font-mono font-medium">{accountNumber}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Bank Name:</span>
                    <span className="text-white font-medium">{bankName}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">IFSC Code:</span>
                    <span className="text-white font-mono font-medium">{ifscCode}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">PAN No:</span>
                    <span className="text-white font-mono font-medium">{panNo}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">UAN NO:</span>
                    <span className="text-white font-mono font-medium">{uanNo}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400 font-medium">Emp Code:</span>
                    <span className="text-indigo-400 font-mono font-bold">{empCode}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SALARY INFO (Basic View-Only Overview)                        */}
        {/* =================================================================== */}
        {profileTab === "salary_info" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <div>
                  <h3 className="text-xl font-serif text-white tracking-tight">
                    Basic Salary Overview
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Your monthly wage and disbursement summary.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                    Wage Type: Fixed Wage
                  </span>
                </div>
              </div>

              {/* Basic Salary Overview Cards (Simple & Clean) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Monthly Gross Wage</span>
                  <p className="text-3xl font-bold font-mono text-white">₹50,000.00 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
                </div>

                <div className="p-5 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Net In-Hand Salary</span>
                  <p className="text-3xl font-bold font-mono text-white">₹46,800.00 <span className="text-xs text-zinc-400 font-normal">/ month</span></p>
                </div>
              </div>

              {/* Disbursement Info (Basic Summary) */}
              <div className="p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/80 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block border-b border-zinc-800/60 pb-2">
                  Disbursement & Account Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block mb-1">Payment Method:</span>
                    <span className="text-white font-medium">Direct Bank Transfer</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Credited Account:</span>
                    <span className="text-white font-mono font-medium">{bankName} ({accountNumber})</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-1">Pay Cycle:</span>
                    <span className="text-emerald-400 font-medium">Monthly (Last Working Day)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-zinc-950/40 border border-zinc-800/60 rounded-xl text-center">
                <p className="text-xs text-zinc-500">
                  Full statutory breakdown and component adjustments are administered by the HR & Payroll team.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: SECURITY (View-Only / Account Status)                         */}
        {/* =================================================================== */}
        {profileTab === "security" && (
          <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-150">
            <h3 className="text-lg font-serif text-white border-b border-zinc-800 pb-3">
              Account Security & Access
            </h3>

            <div className="space-y-4 max-w-xl text-xs sm:text-sm">
              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Enforces biometric/authenticator verification on login</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Active
                </span>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Password Status</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Last updated 18 days ago</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Secured
                </span>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white">Active Session</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">San Francisco, USA • Chrome on macOS / Windows</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Current
                </span>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
