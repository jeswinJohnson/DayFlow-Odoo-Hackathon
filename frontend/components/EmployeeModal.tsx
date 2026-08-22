"use client";

import { useState, useEffect } from "react";
import { MockEmployee, DEPARTMENTS } from "@/data/mockData";
import { useApp } from "@/context/AppContext";
import toast from "react-hot-toast";

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: MockEmployee | null;
  isCreateMode?: boolean;
  onSave: (employeeData: MockEmployee) => void;
  isCurrentUserProfile?: boolean;
}

export function EmployeeModal({
  isOpen,
  onClose,
  employee,
  isCreateMode = false,
  onSave,
  isCurrentUserProfile = false,
}: EmployeeModalProps) {
  const { departments, fetchDepartments, createUser } = useApp();

  // Form State for Create Mode
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [departmentId, setDepartmentId] = useState<string | number>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && isCreateMode) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setIsSubmitting(false);

      if (!departments || departments.length === 0) {
        fetchDepartments().then((depts) => {
          if (depts && depts.length > 0) {
            setDepartmentId(depts[0].id);
          }
        });
      } else {
        setDepartmentId(departments[0].id);
      }
    }
  }, [isCreateMode, isOpen]);

  if (!isOpen) return null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("Please enter first name.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter last name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid work email address.");
      return;
    }

    const deptToSubmit = departmentId || (departments && departments.length > 0 ? departments[0].id : 1);

    setIsSubmitting(true);
    try {
      const result = await createUser({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        department_id: deptToSubmit,
      });

      if (result) {
        const selectedDeptObj = departments?.find((d) => String(d.id) === String(deptToSubmit));
        const deptName = selectedDeptObj ? selectedDeptObj.name : "General";

        const payload: MockEmployee = {
          id: result.employee_id || result.id || `EMP-${String(Math.floor(Math.random() * 900) + 100)}`,
          name: `${firstName.trim()} ${lastName.trim()}`,
          role: result.role || "Team Member",
          department: deptName,
          email: email.trim(),
          phone: phone.trim() || "N/A",
          status: "present",
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
          joinedDate: "Aug 2026",
        };

        onSave(payload);
        onClose();
      }
    } catch (err) {
      console.error("Create employee error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (currStatus?: "present" | "on_leave" | "absent") => {
    switch (currStatus) {
      case "present":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
            Present
          </span>
        );
      case "on_leave":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            On Leave
          </span>
        );
      case "absent":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            Absent
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/40">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {isCurrentUserProfile
              ? "My Profile"
              : isCreateMode
              ? "New Employee"
              : "Employee Info"}
          </span>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          
          {/* ================================================================= */}
          {/* 1. VIEW-ONLY MODE (Profile Picture & Basic Details)               */}
          {/* ================================================================= */}
          {!isCreateMode && employee && (
            <div className="space-y-6">
              
              {/* Profile Overview (Picture, Name, Role, Status) */}
              <div className="flex items-center gap-4.5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-zinc-700 shadow-xl flex-shrink-0">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-left flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-2xl font-serif text-white tracking-tight truncate">
                      {employee.name}
                    </h2>
                  </div>
                  <p className="text-indigo-300 text-sm font-medium truncate">
                    {employee.role}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {employee.department}
                    </span>
                    {renderStatusBadge(employee.status)}
                  </div>
                </div>
              </div>

              {/* Basic Details List */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4.5 space-y-3.5 text-left">
                <div className="flex items-center justify-between text-sm border-b border-zinc-800/60 pb-3">
                  <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Email</span>
                  <a
                    href={`mailto:${employee.email}`}
                    className="text-white font-medium hover:text-indigo-400 transition-colors truncate max-w-[240px]"
                  >
                    {employee.email}
                  </a>
                </div>

                <div className="flex items-center justify-between text-sm border-b border-zinc-800/60 pb-3">
                  <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Phone</span>
                  <span className="text-zinc-200 font-medium font-mono text-xs">
                    {employee.phone}
                  </span>
                </div>

                {employee.location && (
                  <div className="flex items-center justify-between text-sm border-b border-zinc-800/60 pb-3">
                    <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Location</span>
                    <span className="text-zinc-200 font-medium text-xs truncate max-w-[220px]">
                      {employee.location}
                    </span>
                  </div>
                )}

                {employee.bio && (
                  <div className="pt-1 space-y-1">
                    <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider block">Bio</span>
                    <p className="text-zinc-300 text-xs leading-relaxed bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-800/50">
                      {employee.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.99] cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          )}

          {/* ================================================================= */}
          {/* 2. CREATE MODE (Only rendered when NEW button is clicked)         */}
          {/* ================================================================= */}
          {isCreateMode && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    First Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Last Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Morgan"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Work Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dayflow.internal"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Department <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 cursor-pointer"
                  >
                    {departments && departments.length > 0 ? (
                      departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))
                    ) : (
                      DEPARTMENTS.filter((d) => d !== "All Departments").map((dept, idx) => (
                        <option key={dept} value={idx + 1}>
                          {dept}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 active:scale-[0.99] shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Add Employee"
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
