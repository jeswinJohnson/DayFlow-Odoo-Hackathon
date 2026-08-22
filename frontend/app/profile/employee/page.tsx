"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DashboardHeader } from "@/components";
import toast from "react-hot-toast";

export default function EmployeeProfilePage() {
  const { activeUser, myProfile, profileLoading, fetchMyProfile, updateMyProfile } = useApp();

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

  // Resume Form State
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
    }
  }, [myProfile]);

  // Derived Header Profile Fields
  const firstName = myProfile?.f_name ?? activeUser?.first_name ?? null;
  const lastName = myProfile?.l_name ?? activeUser?.last_name ?? null;
  const name = (firstName || lastName) ? `${firstName || ""} ${lastName || ""}`.trim() : "null";

  const email = myProfile?.email ?? activeUser?.email ?? "null";
  const loginId = activeUser?.id ?? "null";
  const company = myProfile?.comp_name ?? "null";
  const department = myProfile?.dept_name ?? activeUser?.department_name ?? "null";
  const manager = myProfile?.manager_name ?? "null";
  const location = myProfile?.location ?? "null";
  const avatar =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

  // Private Info Fields (Strict View Only)
  const pEmail = myProfile?.p_email ?? null;
  const dob = myProfile?.dob ? myProfile.dob.split("T")[0] : null;
  const nationality = myProfile?.nationality ?? null;
  const gender = myProfile?.gender ?? null;
  const maritalStatus = myProfile?.marital_status ?? null;
  const doj = myProfile?.doj ? myProfile.doj.split("T")[0] : null;
  const uanNo = myProfile?.uan_no ?? null;
  const panNo = myProfile?.pan_no ?? null;
  const ifscCode = myProfile?.ifsc_code ?? null;
  const bankName = myProfile?.bank_name ?? null;
  const accNumber = myProfile?.acc_number ?? null;

  // Resume Update Handlers
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
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800/80"></div>
              <div className="w-36 h-7 rounded-lg bg-zinc-800/80"></div>
            </div>
            <div className="w-24 h-6 rounded-full bg-zinc-800/80"></div>
          </div>
          <div className="w-full bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-800/80 flex-shrink-0"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                <div className="space-y-3">
                  <div className="w-48 h-8 bg-zinc-800/80 rounded-lg"></div>
                  <div className="w-36 h-4 bg-zinc-800/80 rounded-md"></div>
                </div>
                <div className="space-y-3 bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/60">
                  <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
                  <div className="w-full h-4 bg-zinc-800/80 rounded-md"></div>
                </div>
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

      {/* Main Container */}
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
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              Employee View
            </span>
          </div>
        </div>

        {/* Hero Profile Info Card */}
        <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover select-none"
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
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: RESUME (Editable for Bio, Skills, Certifications)            */}
        {/* =================================================================== */}
        {profileTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            
            {/* Left Column: Bio Block */}
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

            {/* Right Column: Skills & Certifications */}
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

                {/* Add Skill Form */}
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
        {/* TAB 2: PRIVATE INFO (Strict View Only - No Edit)                     */}
        {/* =================================================================== */}
        {profileTab === "private_info" && (
          <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-150">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-serif text-white">
                Private Personal & Statutory Information
              </h3>
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Strict View Only
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Personal Information */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white border-b border-zinc-800 pb-2">
                  Personal Information
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Date of Birth:</span>
                    <span className="text-white font-medium">{dob || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Residing Address:</span>
                    <span className="text-white font-medium text-right max-w-[260px]">{location}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Nationality:</span>
                    <span className="text-white font-medium">{nationality || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Personal Email:</span>
                    {pEmail ? (
                      <a href={`mailto:${pEmail}`} className="text-indigo-400 hover:underline font-medium">
                        {pEmail}
                      </a>
                    ) : (
                      <span className="text-white font-medium">null</span>
                    )}
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Gender:</span>
                    <span className="text-white font-medium">{gender || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Marital Status:</span>
                    <span className="text-white font-medium">{maritalStatus || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400 font-medium">Date of Joining:</span>
                    <span className="text-emerald-400 font-semibold">{doj || "null"}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Bank Details & Statutory IDs */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white border-b border-zinc-800 pb-2">
                  Bank Details & Identifications
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Account Number:</span>
                    <span className="text-white font-mono font-medium">{accNumber || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Bank Name:</span>
                    <span className="text-white font-medium">{bankName || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">IFSC Code:</span>
                    <span className="text-white font-mono font-medium">{ifscCode || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">PAN No:</span>
                    <span className="text-white font-mono font-medium">{panNo || "null"}</span>
                  </div>

                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400 font-medium">UAN NO:</span>
                    <span className="text-white font-mono font-medium">{uanNo || "null"}</span>
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

              {/* Basic Salary Overview Cards */}
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

              {/* Disbursement Info */}
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
                    <span className="text-white font-mono font-medium">{bankName || "Silicon Valley Bank"} ({accNumber || "•••• •••• 9821"})</span>
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

      </main>

    </div>
  );
}
