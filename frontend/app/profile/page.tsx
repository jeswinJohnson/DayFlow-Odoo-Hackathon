"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { DashboardHeader } from "@/components";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { activeUser } = useApp();

  // Navigation State
  const [activeNavTab, setActiveNavTab] = useState<"employees" | "attendance" | "time_off">("employees");
  const [profileTab, setProfileTab] = useState<"resume" | "private_info" | "salary_info">("resume");

  // Systray State
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>("08:45 AM");

  // Profile Header State
  const [name, setName] = useState(activeUser?.name || "Alex Morgan");
  const [loginId] = useState(activeUser?.uid || activeUser?.id || "EMP-001");
  const [email, setEmail] = useState(activeUser?.email || "alex.morgan@dayflow.internal");
  const [mobile, setMobile] = useState("+1 (555) 234-5678");
  const [company, setCompany] = useState("DayFlow Technologies Inc.");
  const [department, setDepartment] = useState(activeUser?.department_name || "Engineering");
  const [manager, setManager] = useState("Elena Rostova (VP of People)");
  const [location, setLocation] = useState("Floor 4 - Tech Bay A, San Francisco HQ");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  );

  // Resume Tab Content State (from Wireframe)
  const [aboutText, setAboutText] = useState(
    "Lead software architect specializing in distributed cloud infrastructure, real-time sync engines, and resilient enterprise web architecture. Passionate about craftsmanship, high-velocity developer experience, and product excellence."
  );
  const [editingAbout, setEditingAbout] = useState(false);

  const [jobLoveText, setJobLoveText] = useState(
    "Collaborating with an exceptional team to solve complex engineering challenges, architecting high-impact features, and mentoring engineers to achieve their fullest technical potential."
  );
  const [editingJobLove, setEditingJobLove] = useState(false);

  const [hobbiesText, setHobbiesText] = useState(
    "Mechanical keyboards, trail running, open-source tooling, landscape photography, and experimenting with procedural graphics."
  );
  const [editingHobbies, setEditingHobbies] = useState(false);

  // Skills State
  const [skills, setSkills] = useState<string[]>([
    "TypeScript",
    "React / Next.js",
    "Distributed Systems",
    "TailwindCSS",
    "Supabase / PostgreSQL",
    "GraphQL",
    "Docker & Kubernetes",
    "CI/CD Pipelines",
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);

  // Certifications State
  const [certifications, setCertifications] = useState<
    { name: string; issuer: string; year: string }[]
  >([
    { name: "AWS Certified Solutions Architect - Professional", issuer: "Amazon Web Services", year: "2024" },
    { name: "Certified Kubernetes Administrator (CKA)", issuer: "Linux Foundation", year: "2023" },
    { name: "Google Cloud Professional Cloud Architect", issuer: "Google Cloud", year: "2022" },
  ]);
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState("");
  const [showAddCert, setShowAddCert] = useState(false);

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

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (skills.includes(newSkillInput.trim())) {
      toast.error("Skill already added.");
      return;
    }
    setSkills((prev) => [...prev, newSkillInput.trim()]);
    setNewSkillInput("");
    setShowAddSkill(false);
    toast.success("Skill added!");
  };

  // Remove Skill
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
    toast("Skill removed.");
  };

  // Add Certification
  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName.trim() || !newCertIssuer.trim()) {
      toast.error("Please fill in certification name and issuer.");
      return;
    }
    setCertifications((prev) => [
      ...prev,
      {
        name: newCertName.trim(),
        issuer: newCertIssuer.trim(),
        year: newCertYear.trim() || "2026",
      },
    ]);
    setNewCertName("");
    setNewCertIssuer("");
    setNewCertYear("");
    setShowAddCert(false);
    toast.success("Certification added!");
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

      {/* Main Profile Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Title Bar & Back Navigation (Exact Wireframe Architecture) */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Back to Employees"
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

        {/* Hero Profile Info Card (Exact Wireframe Layout) */}
        <div className="w-full bg-zinc-900/70 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            
            {/* Profile Avatar (Non-editable view) */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Metadata (Dual Column Layout as in Wireframe) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full text-left">
              
              {/* Left Column: Name, Login ID, Email, Mobile */}
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

        {/* Profile Sub-Tabs Navigation (Resume | Private Info | Salary Info) */}
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
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: RESUME (About, What I love, Hobbies, Skills, Certifications) */}
        {/* =================================================================== */}
        {profileTab === "resume" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-150">
            
            {/* Left Column: About & Stories (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* About Section */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">About</h3>
                  <button
                    onClick={() => setEditingAbout(!editingAbout)}
                    className="p-1.5 text-zinc-400 hover:text-indigo-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit About"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                {editingAbout ? (
                  <div className="space-y-3">
                    <textarea
                      rows={4}
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingAbout(false)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {aboutText}
                  </p>
                )}
              </div>

              {/* What I love about my job Section */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">What I love about my job</h3>
                  <button
                    onClick={() => setEditingJobLove(!editingJobLove)}
                    className="p-1.5 text-zinc-400 hover:text-indigo-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit Story"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                {editingJobLove ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={jobLoveText}
                      onChange={(e) => setJobLoveText(e.target.value)}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingJobLove(false)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {jobLoveText}
                  </p>
                )}
              </div>

              {/* My interests and hobbies Section */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl rounded-3xl p-6 space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                  <h3 className="text-base font-semibold text-white">My interests and hobbies</h3>
                  <button
                    onClick={() => setEditingHobbies(!editingHobbies)}
                    className="p-1.5 text-zinc-400 hover:text-indigo-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Edit Hobbies"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                {editingHobbies ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={hobbiesText}
                      onChange={(e) => setHobbiesText(e.target.value)}
                      className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingHobbies(false)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {hobbiesText}
                  </p>
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
                      placeholder="e.g. Next.js, Rust..."
                      className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Add
                    </button>
                  </form>
                )}

                {/* Skill Chips Cluster */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.map((skill) => (
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
                  ))}
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
                        required
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
                        className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}

                {/* Certification List */}
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
        {/* TAB 2: PRIVATE INFO                                                 */}
        {/* =================================================================== */}
        {profileTab === "private_info" && (
          <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-150">
            <h3 className="text-lg font-serif text-white border-b border-zinc-800 pb-3">
              Private Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Personal Email</span>
                <p className="text-sm font-medium text-white">alex.morgan.personal@example.com</p>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Date of Birth</span>
                <p className="text-sm font-medium text-white">October 14, 1994</p>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Nationality</span>
                <p className="text-sm font-medium text-white">United States</p>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1 sm:col-span-2">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Residential Address</span>
                <p className="text-sm font-medium text-white">742 Evergreen Terrace, San Francisco, CA 94107</p>
              </div>

              <div className="p-4 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Emergency Contact</span>
                <p className="text-sm font-medium text-white">Taylor Morgan • +1 (555) 987-6543</p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: SALARY INFO                                                  */}
        {/* =================================================================== */}
        {profileTab === "salary_info" && (
          <div className="bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 text-left animate-in fade-in duration-150">
            <h3 className="text-lg font-serif text-white border-b border-zinc-800 pb-3">
              Compensation & Salary Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Base Salary</span>
                <p className="text-2xl font-bold text-white font-mono">$165,000 <span className="text-xs font-normal text-zinc-400">/ yr</span></p>
              </div>

              <div className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Pay Frequency</span>
                <p className="text-2xl font-bold text-indigo-300">Semi-Monthly</p>
              </div>

              <div className="p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Next Payroll Date</span>
                <p className="text-2xl font-bold text-emerald-400">Sep 01, 2026</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Bank Account</span>
                <p className="text-sm font-mono text-zinc-200">Chase Bank •••• 4892 (Direct Deposit)</p>
              </div>

              <div className="p-4 bg-zinc-950/40 border border-zinc-800/60 rounded-2xl space-y-1">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Tax Identification (SSN)</span>
                <p className="text-sm font-mono text-zinc-200">•••-••-6789 (Verified)</p>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
