"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DashboardHeader } from "@/components";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { activeUser, myProfile, profileLoading, fetchMyProfile, updateMyProfile } = useApp();

  // Role Access (Admin View)
  const isAdmin = true;

  // Fetch Profile on Mount
  useEffect(() => {
    fetchMyProfile();
  }, []);

  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<"employees" | "attendance" | "time_off">("employees");
  const [profileTab, setProfileTab] = useState<"resume" | "private_info" | "salary_info">("resume");

  // Systray State
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>("08:45 AM");

  // Private Info Form State
  const [isEditingPrivate, setIsEditingPrivate] = useState(false);
  const [privateFormData, setPrivateFormData] = useState({
    p_email: "",
    dob: "",
    nationality: "",
    gender: "",
    marital_status: "",
    doj: "",
    uan_no: "",
    pan_no: "",
    ifsc_code: "",
    bank_name: "",
    acc_number: "",
    location: "",
  });

  // Single Bio Text Block State
  const [bioText, setBioText] = useState("");
  const [editingBio, setEditingBio] = useState(false);

  // Skills State
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Certifications State
  const [certifications, setCertifications] = useState<
    { name: string; issuer: string; year: string }[]
  >([]);
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState("");
  const [showAddCert, setShowAddCert] = useState(false);

  // Sync myProfile from context when fetched or updated
  useEffect(() => {
    if (myProfile) {
      setBioText(myProfile.bio || "");
      if (myProfile.skills && Array.isArray(myProfile.skills)) {
        setSkills(myProfile.skills);
      } else {
        setSkills([]);
      }
      if (myProfile.certification && Array.isArray(myProfile.certification)) {
        setCertifications(
          myProfile.certification.map((c) => {
            if (c.includes(" | ")) {
              const [cName, cIssuer, cYear] = c.split(" | ");
              return { name: cName || c, issuer: cIssuer || "", year: cYear || "" };
            }
            return { name: c, issuer: "", year: "" };
          })
        );
      } else {
        setCertifications([]);
      }
      setPrivateFormData({
        p_email: myProfile.p_email || "",
        dob: myProfile.dob ? myProfile.dob.split("T")[0] : "",
        nationality: myProfile.nationality || "",
        gender: myProfile.gender || "",
        marital_status: myProfile.marital_status || "",
        doj: myProfile.doj ? myProfile.doj.split("T")[0] : "",
        uan_no: myProfile.uan_no || "",
        pan_no: myProfile.pan_no || "",
        ifsc_code: myProfile.ifsc_code || "",
        bank_name: myProfile.bank_name || "",
        acc_number: myProfile.acc_number || "",
        location: myProfile.location || "",
      });
    }
  }, [myProfile]);

  // Derived Header Profile Fields (No boilerplate/mock fallbacks, strictly null if null)
  const firstName = myProfile?.f_name ?? activeUser?.first_name ?? null;
  const lastName = myProfile?.l_name ?? activeUser?.last_name ?? null;
  const name = (firstName || lastName) ? `${firstName || ""} ${lastName || ""}`.trim() : "null";

  const email = myProfile?.email ?? activeUser?.email ?? "null";
  const loginId = email;
  const company = myProfile?.comp_name ?? "null";
  const department = myProfile?.dept_name ?? activeUser?.department_name ?? "null";
  const manager = myProfile?.manager_name ?? "null";
  const location = myProfile?.location ?? (privateFormData.location || "null");
  const avatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

  // API Integration Handlers
  const handleSaveBio = async () => {
    const res = await updateMyProfile({ bio: bioText });
    if (res) setEditingBio(false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const newSkill = newSkillInput.trim();
    if (skills.includes(newSkill)) {
      toast.error("Skill already added.");
      return;
    }
    const updatedSkills = [...skills, newSkill];
    const res = await updateMyProfile({ skills: updatedSkills });
    if (res) {
      setSkills(updatedSkills);
      setNewSkillInput("");
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    const res = await updateMyProfile({ skills: updatedSkills });
    if (res) {
      setSkills(updatedSkills);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim()) {
      toast.error("Please fill in certification name.");
      return;
    }
    const certString = newCertIssuer.trim()
      ? `${newCertName.trim()} | ${newCertIssuer.trim()} | ${newCertYear.trim()}`
      : newCertName.trim();
    const currentCertStrings = certifications.map((c) =>
      c.issuer ? `${c.name} | ${c.issuer} | ${c.year}` : c.name
    );
    const updatedCerts = [...currentCertStrings, certString];
    const res = await updateMyProfile({ certification: updatedCerts });
    if (res) {
      setCertifications((prev) => [
        ...prev,
        {
          name: newCertName.trim(),
          issuer: newCertIssuer.trim(),
          year: newCertYear.trim(),
        },
      ]);
      setNewCertName("");
      setNewCertIssuer("");
      setNewCertYear("");
      setShowAddCert(false);
    }
  };

  const handleSavePrivateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateMyProfile({
      p_email: privateFormData.p_email || null,
      dob: privateFormData.dob ? new Date(privateFormData.dob).toISOString() : null,
      nationality: privateFormData.nationality || null,
      gender: privateFormData.gender || null,
      marital_status: privateFormData.marital_status || null,
      doj: privateFormData.doj ? new Date(privateFormData.doj).toISOString() : null,
      uan_no: privateFormData.uan_no || null,
      pan_no: privateFormData.pan_no || null,
      ifsc_code: privateFormData.ifsc_code || null,
      bank_name: privateFormData.bank_name || null,
      acc_number: privateFormData.acc_number || null,
      location: privateFormData.location || null,
    });
    if (res) {
      setIsEditingPrivate(false);
    }
  };

  // =========================================================================
  // SALARY INFORMATION STATE & AUTOMATIC ACCURATE CALCULATION ENGINE
  // =========================================================================
  const [monthlyWageStr, setMonthlyWageStr] = useState<string>("50000");
  const [workingDaysStr, setWorkingDaysStr] = useState<string>("5");
  const [workingDaysError, setWorkingDaysError] = useState<string>("");
  const [breakTimeStr, setBreakTimeStr] = useState<string>("1");

  // Real-time Salary Breakdown Engine
  const salaryCalculations = useMemo(() => {
    const parsedWage = parseFloat(monthlyWageStr.replace(/[^0-9.]/g, "")) || 0;
    const wage = Math.max(0, parsedWage);
    const yearly = wage * 12;

    const basic = wage * 0.50;
    const hra = basic * 0.50;
    const standardAllowance = Math.round(basic * (16.668 / 100) * 100) / 100;
    const performanceBonus = Math.round(basic * (8.33 / 100) * 100) / 100;
    const lta = Math.round(basic * (8.33 / 100) * 100) / 100;
    const sumOther = basic + hra + standardAllowance + performanceBonus + lta;
    const fixedAllowance = Math.max(0, Math.round((wage - sumOther) * 100) / 100);
    const fixedAllowancePct = basic > 0 ? (fixedAllowance / basic) * 100 : 0;

    const employeePF = Math.round(basic * 0.12 * 100) / 100;
    const employerPF = Math.round(basic * 0.12 * 100) / 100;
    const professionalTax = wage > 0 ? 200 : 0;
    const totalDeductions = employeePF + professionalTax;
    const netTakeHome = Math.max(0, Math.round((wage - totalDeductions) * 100) / 100);

    return {
      wage,
      yearly,
      basic,
      hra,
      standardAllowance,
      performanceBonus,
      lta,
      fixedAllowance,
      fixedAllowancePct,
      employeePF,
      employerPF,
      professionalTax,
      totalDeductions,
      netTakeHome,
    };
  }, [monthlyWageStr]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

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

  // Skeleton Loading Screen
  if (profileLoading && !myProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white">
        <DashboardHeader
          activeTab={activeNavTab}
          setActiveTab={setActiveNavTab}
          isCheckedIn={isCheckedIn}
          checkInTime={checkInTime}
          onToggleCheckIn={handleToggleCheckIn}
          onOpenMyProfile={() => {}}
        />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800/80"></div>
              <div className="w-36 h-7 rounded-lg bg-zinc-800/80"></div>
            </div>
            <div className="w-24 h-6 rounded-full bg-zinc-800/80"></div>
          </div>

          {/* Hero Profile Card Skeleton */}
          <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-800/80 flex-shrink-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                <div className="space-y-3">
                  <div className="w-48 h-8 bg-zinc-800/80 rounded-lg"></div>
                  <div className="w-36 h-4 bg-zinc-800/80 rounded-md"></div>
                  <div className="w-44 h-4 bg-zinc-800/80 rounded-md"></div>
                </div>
                <div className="space-y-3 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/60">
                  <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
                  <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
                  <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
                  <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-4 border-b border-zinc-800 pb-3">
            <div className="w-24 h-8 bg-zinc-800/80 rounded-lg"></div>
            <div className="w-28 h-8 bg-zinc-800/80 rounded-lg"></div>
            <div className="w-24 h-8 bg-zinc-800/80 rounded-lg"></div>
          </div>

          {/* Body Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 h-72 space-y-4">
              <div className="w-24 h-5 bg-zinc-800/80 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
              <div className="w-5/6 h-4 bg-zinc-800/80 rounded-md"></div>
              <div className="w-4/6 h-4 bg-zinc-800/80 rounded-md"></div>
            </div>
            <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 h-72 space-y-4">
              <div className="w-24 h-5 bg-zinc-800/80 rounded-md"></div>
              <div className="flex flex-wrap gap-2">
                <div className="w-20 h-7 bg-zinc-800/80 rounded-xl"></div>
                <div className="w-24 h-7 bg-zinc-800/80 rounded-xl"></div>
                <div className="w-16 h-7 bg-zinc-800/80 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

      {/* Main Profile Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Title Bar & Back Navigation */}
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
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
              Admin View
            </span>
          </div>
        </div>

        {/* Hero Profile Info Card */}
        <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            
            {/* Profile Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full text-left">
              
              {/* Left Column: Name, Email */}
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    {name}
                  </h2>
                  <p className="text-xs text-indigo-400 font-mono mt-0.5">
                    Login ID: <span className="text-zinc-200 font-semibold">{loginId}</span>
                  </p>
                </div>

                <div className="space-y-1.5 text-xs sm:text-sm pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-medium w-16">Email:</span>
                    <a href={`mailto:${email}`} className="text-white hover:text-indigo-400 transition-colors font-medium">
                      {email}
                    </a>
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

        {/* Profile Sub-Tabs Navigation */}
        <div className="border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProfileTab("resume")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                profileTab === "resume"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Resume
            </button>

            <button
              onClick={() => setProfileTab("private_info")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                profileTab === "private_info"
                  ? "border-indigo-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Private Info
            </button>

            {isAdmin && (
              <button
                onClick={() => setProfileTab("salary_info")}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                  profileTab === "salary_info"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Salary Info
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: RESUME (Single Bio Block, Skills, Certifications)           */}
        {/* =================================================================== */}
        {profileTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            
            {/* Left Column: Huge Bio Block Text Section (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <h3 className="text-lg font-serif text-white">Bio</h3>
                  <button
                    onClick={() => setEditingBio(!editingBio)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-colors cursor-pointer"
                  >
                    {editingBio ? "Cancel" : "Edit Bio"}
                  </button>
                </div>

                {editingBio ? (
                  <div className="space-y-4">
                    <textarea
                      rows={10}
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      placeholder="Enter bio text..."
                      className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y font-sans leading-relaxed"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSaveBio}
                        disabled={profileLoading}
                        className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {profileLoading ? "Saving..." : "Save Bio"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[160px]">
                    {bioText ? (
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {bioText}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-500 italic">null</p>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Skills & Certifications (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Skills Card */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">Skills</h3>
                  <button
                    onClick={() => setShowAddSkill(!showAddSkill)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    + Add Skills
                  </button>
                </div>

                {/* Add Skill Input Form */}
                {showAddSkill && (
                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      placeholder="e.g. Next.js, Python..."
                      className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Add
                    </button>
                  </form>
                )}

                {/* Skill Chips Cluster */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-zinc-200 text-xs font-medium group hover:border-zinc-700 transition-colors"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove skill"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">null</span>
                  )}
                </div>
              </div>

              {/* Certification Card */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">Certification</h3>
                  <button
                    onClick={() => setShowAddCert(!showAddCert)}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    + Add Certification
                  </button>
                </div>

                {/* Add Certification Form */}
                {showAddCert && (
                  <form onSubmit={handleAddCert} className="space-y-2 bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800">
                    <input
                      type="text"
                      required
                      value={newCertName}
                      onChange={(e) => setNewCertName(e.target.value)}
                      placeholder="Certification Title"
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        placeholder="Issuer (e.g. AWS)"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={newCertYear}
                        onChange={(e) => setNewCertYear(e.target.value)}
                        placeholder="Year (e.g. 2024)"
                        className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddCert(false)}
                        className="px-3 py-1 text-xs text-zinc-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs disabled:opacity-50"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {/* Certification List */}
                <div className="space-y-3">
                  {certifications.length > 0 ? (
                    certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-semibold text-white">{cert.name}</h4>
                          {cert.issuer && <p className="text-[11px] text-zinc-400">{cert.issuer}</p>}
                        </div>
                        {cert.year && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 rounded-md">
                            {cert.year}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">null</span>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: PRIVATE INFO                                                 */}
        {/* =================================================================== */}
        {profileTab === "private_info" && (
          <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-serif text-white">
                Private Personal & Statutory Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingPrivate(!isEditingPrivate)}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-colors cursor-pointer"
              >
                {isEditingPrivate ? "Cancel Editing" : "Edit Information"}
              </button>
            </div>

            {isEditingPrivate ? (
              <form onSubmit={handleSavePrivateInfo} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      value={privateFormData.p_email}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, p_email: e.target.value })}
                      placeholder="Personal Email"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={privateFormData.dob}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, dob: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={privateFormData.nationality}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, nationality: e.target.value })}
                      placeholder="Nationality"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Gender
                    </label>
                    <input
                      type="text"
                      value={privateFormData.gender}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, gender: e.target.value })}
                      placeholder="Gender"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Marital Status
                    </label>
                    <input
                      type="text"
                      value={privateFormData.marital_status}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, marital_status: e.target.value })}
                      placeholder="Marital Status"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      value={privateFormData.doj}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, doj: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Location / Address
                    </label>
                    <input
                      type="text"
                      value={privateFormData.location}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, location: e.target.value })}
                      placeholder="Location / Address"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Statutory & Banking Section */}
                  <div className="sm:col-span-2 lg:col-span-3 border-t border-zinc-800 pt-4 mt-2">
                    <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">
                      Statutory & Banking Info
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      UAN Number
                    </label>
                    <input
                      type="text"
                      value={privateFormData.uan_no}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, uan_no: e.target.value })}
                      placeholder="UAN Number"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      value={privateFormData.pan_no}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, pan_no: e.target.value })}
                      placeholder="PAN Number"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={privateFormData.bank_name}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, bank_name: e.target.value })}
                      placeholder="Bank Name"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={privateFormData.ifsc_code}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, ifsc_code: e.target.value })}
                      placeholder="IFSC Code"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={privateFormData.acc_number}
                      onChange={(e) => setPrivateFormData({ ...privateFormData, acc_number: e.target.value })}
                      placeholder="Account Number"
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingPrivate(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50"
                  >
                    {profileLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Personal Email</span>
                  <p className="text-sm font-medium text-white">{privateFormData.p_email || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Date of Birth</span>
                  <p className="text-sm font-medium text-white">{privateFormData.dob || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Nationality</span>
                  <p className="text-sm font-medium text-white">{privateFormData.nationality || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Gender</span>
                  <p className="text-sm font-medium text-white">{privateFormData.gender || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Marital Status</span>
                  <p className="text-sm font-medium text-white">{privateFormData.marital_status || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Date of Joining</span>
                  <p className="text-sm font-medium text-white">{privateFormData.doj || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1 sm:col-span-2 lg:col-span-3">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Location / Address</span>
                  <p className="text-sm font-medium text-white">{location}</p>
                </div>

                {/* Banking & Statutory Details Display */}
                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">UAN Number</span>
                  <p className="text-sm font-mono font-medium text-white">{privateFormData.uan_no || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">PAN Number</span>
                  <p className="text-sm font-mono font-medium text-white">{privateFormData.pan_no || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Bank Name</span>
                  <p className="text-sm font-medium text-white">{privateFormData.bank_name || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">IFSC Code</span>
                  <p className="text-sm font-mono font-medium text-white">{privateFormData.ifsc_code || "null"}</p>
                </div>

                <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1 sm:col-span-2">
                  <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Account Number</span>
                  <p className="text-sm font-mono font-medium text-white">{privateFormData.acc_number || "null"}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SALARY INFO (ACCURATE REAL-TIME CALCULATION - ADMIN ONLY)   */}
        {/* =================================================================== */}
        {profileTab === "salary_info" && isAdmin && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Top Wage Input & Schedule Config */}
            <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                <div>
                  <h3 className="text-xl font-serif text-white tracking-tight">
                    Salary Information & Structure
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Define base monthly wages. All components and statutory deductions auto-compute in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                    Wage Type: Fixed Wage
                  </span>
                </div>
              </div>

              {/* Monthly & Yearly Wage Row + Working Days Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                
                {/* Monthly Wage Input */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Monthly Wage
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 text-sm font-mono select-none">
                      ₹
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyWageStr}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setMonthlyWageStr(val);
                      }}
                      className="w-full pl-7 pr-16 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 text-xs font-medium select-none pointer-events-none">
                      / Month
                    </span>
                  </div>
                </div>

                {/* Yearly Wage (Auto-Computed) */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-1.5">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Yearly Wage
                  </span>
                  <div className="flex items-center justify-between py-2 px-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="text-white font-mono font-bold text-base">
                      {formatCurrency(salaryCalculations.yearly)}
                    </span>
                    <span className="text-zinc-400 text-xs font-medium select-none">
                      / Yearly
                    </span>
                  </div>
                </div>

                {/* Working Days Config */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Number of working days in a week
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={workingDaysStr}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setWorkingDaysStr(val);
                        if (val === "") {
                          setWorkingDaysError("");
                          return;
                        }
                        const num = parseInt(val, 10);
                        if (num < 1 || num > 7) {
                          setWorkingDaysError("Please enter a valid number (1 - 7)");
                          toast.error("Please enter a valid number between 1 and 7.");
                        } else {
                          setWorkingDaysError("");
                        }
                      }}
                      className={`w-full px-3 py-2 pr-12 bg-zinc-900 border rounded-xl text-white font-mono font-bold text-sm focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        workingDaysError
                          ? "border-rose-500/80 focus:ring-2 focus:ring-rose-500/50"
                          : "border-zinc-700/80 focus:ring-2 focus:ring-indigo-500"
                      }`}
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 text-xs select-none pointer-events-none">
                      Days
                    </span>
                  </div>
                  {workingDaysError && (
                    <p className="text-[11px] text-rose-400 font-medium animate-in fade-in duration-150">
                      {workingDaysError}
                    </p>
                  )}
                </div>

                {/* Break Time Config */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-2xl space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Break Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={breakTimeStr}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, "");
                        const num = parseFloat(val);
                        if (val === "" || (num >= 0 && num <= 24)) {
                          setBreakTimeStr(val);
                        }
                      }}
                      className="w-full px-3 py-2 pr-12 bg-zinc-900 border border-zinc-700/80 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 text-xs select-none pointer-events-none">
                      / hrs
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Salary Breakdown & Statutory Deductions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Salary Components (7 cols) */}
              <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 space-y-4 text-left">
                <div className="border-b border-zinc-800/60 pb-3">
                  <h4 className="text-base font-semibold text-white">Salary Components</h4>
                </div>

                <div className="space-y-3">
                  
                  {/* 1. Basic Salary */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Basic Salary</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {formatCurrency(salaryCalculations.basic)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 min-w-[56px] text-center">
                        50.00 %
                      </span>
                    </div>
                  </div>

                  {/* 2. House Rent Allowance (HRA) */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">House Rent Allowance</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {formatCurrency(salaryCalculations.hra)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 min-w-[56px] text-center">
                        50.00 %
                      </span>
                    </div>
                  </div>

                  {/* 3. Standard Allowance */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Standard Allowance</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {formatCurrency(salaryCalculations.standardAllowance)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 min-w-[56px] text-center">
                        16.67 %
                      </span>
                    </div>
                  </div>

                  {/* 4. Performance Bonus */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Performance Bonus</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {formatCurrency(salaryCalculations.performanceBonus)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 min-w-[56px] text-center">
                        8.33 %
                      </span>
                    </div>
                  </div>

                  {/* 5. Leave Travel Allowance (LTA) */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Leave Travel Allowance</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {formatCurrency(salaryCalculations.lta)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 min-w-[56px] text-center">
                        8.33 %
                      </span>
                    </div>
                  </div>

                  {/* 6. Fixed Allowance */}
                  <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Fixed Allowance</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {formatCurrency(salaryCalculations.fixedAllowance)}
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-mono font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 min-w-[56px] text-center">
                        {salaryCalculations.fixedAllowancePct.toFixed(2)} %
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: PF, Deductions, and Net Take-Home (5 cols) */}
              <div className="lg:col-span-5 space-y-6 text-left">
                
                {/* Provident Fund (PF) Contribution */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                    <h4 className="text-base font-semibold text-white">Provident Fund (PF)</h4>
                    <span className="text-xs text-zinc-400">Statutory</span>
                  </div>

                  <div className="space-y-3">
                    {/* Employee PF */}
                    <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                      <span className="text-zinc-300 font-semibold text-xs">Employee PF</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs">
                          {formatCurrency(salaryCalculations.employeePF)}
                        </span>
                        <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                          12.00 %
                        </span>
                      </div>
                    </div>

                    {/* Employer PF */}
                    <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                      <span className="text-zinc-300 font-semibold text-xs">Employer's PF</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-xs">
                          {formatCurrency(salaryCalculations.employerPF)}
                        </span>
                        <span className="text-[10px] font-mono bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                          12.00 %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Deductions */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                    <h4 className="text-base font-semibold text-white">Tax Deductions</h4>
                    <span className="text-xs text-zinc-400">Monthly</span>
                  </div>

                  <div className="p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between">
                    <span className="text-zinc-300 font-semibold text-xs">Professional Tax</span>
                    <span className="font-mono font-bold text-rose-400 text-xs">
                      - {formatCurrency(salaryCalculations.professionalTax)}
                    </span>
                  </div>
                </div>

                {/* Net In-Hand Salary Card */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                    <h4 className="text-base font-semibold text-white">Net In-Hand Salary</h4>
                    <span className="text-xs text-zinc-400">Monthly</span>
                  </div>

                  <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight">
                        {formatCurrency(salaryCalculations.netTakeHome)}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">/ month</span>
                    </div>

                    <div className="space-y-1.5 pt-2.5 border-t border-zinc-800/80 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Gross Earnings:</span>
                        <span className="text-white font-mono font-medium">{formatCurrency(salaryCalculations.wage)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Total Deductions (PF + Tax):</span>
                        <span className="text-rose-400 font-mono font-medium">- {formatCurrency(salaryCalculations.totalDeductions)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
