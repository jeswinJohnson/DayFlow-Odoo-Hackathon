"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import {
  DashboardHeader,
  ActionBar,
  EmployeeCard,
  EmployeeModal,
  AttendanceView,
  TimeOffView,
} from "@/components";
import {
  MockEmployee,
  MockAttendance,
  MockTimeOff,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_TIME_OFF,
} from "@/data/mockData";
import toast from "react-hot-toast";

export default function Home() {
  const { activeUser } = useApp();

  // Navigation State
  const [activeTab, setActiveTab] = useState<"employees" | "attendance" | "time_off">("employees");

  // Systray Check-In State
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>("08:45 AM");

  // Data Collections State
  const [employees, setEmployees] = useState<MockEmployee[]>(INITIAL_EMPLOYEES);
  const [attendanceRecords, setAttendanceRecords] = useState<MockAttendance[]>(INITIAL_ATTENDANCE);
  const [timeOffRequests, setTimeOffRequests] = useState<MockTimeOff[]>(INITIAL_TIME_OFF);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");

  // Modal State
  const [selectedEmployee, setSelectedEmployee] = useState<MockEmployee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false);

  // Toggle Check IN / OUT
  const handleToggleCheckIn = () => {
    if (isCheckedIn) {
      // Check OUT
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(false);
      setCheckInTime(null);

      // Add to attendance log
      const newRecord: MockAttendance = {
        id: `ATT-${Date.now()}`,
        employeeId: activeUser?.id || "EMP-001",
        employeeName: activeUser?.name || "Alex Morgan",
        date: "Today",
        checkIn: checkInTime || "08:45 AM",
        checkOut: nowTime,
        workHours: "8h 12m",
        status: "on_time",
      };
      setAttendanceRecords((prev) => [newRecord, ...prev]);

      // Update employee status
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === "EMP-001" ? { ...emp, status: "absent" } : emp
        )
      );

      toast("Checked OUT successfully.", { icon: "👋" });
    } else {
      // Check IN
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsCheckedIn(true);
      setCheckInTime(nowTime);

      // Add to attendance log
      const newRecord: MockAttendance = {
        id: `ATT-${Date.now()}`,
        employeeId: activeUser?.id || "EMP-001",
        employeeName: activeUser?.name || "Alex Morgan",
        date: "Today",
        checkIn: nowTime,
        workHours: "Just Started",
        status: "on_time",
      };
      setAttendanceRecords((prev) => [newRecord, ...prev]);

      // Update employee status
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === "EMP-001" ? { ...emp, status: "present", checkInTime: nowTime } : emp
        )
      );

      toast.success(`Checked IN at ${nowTime}!`);
    }
  };

  // Open "NEW" Employee Modal
  const handleOpenNewEmployee = () => {
    setSelectedEmployee(null);
    setIsCreateMode(true);
    setIsCurrentUserProfile(false);
    setIsModalOpen(true);
  };

  // Open Selected Employee Modal
  const handleSelectEmployee = (emp: MockEmployee) => {
    setSelectedEmployee(emp);
    setIsCreateMode(false);
    setIsCurrentUserProfile(false);
    setIsModalOpen(true);
  };

  // Open "My Profile" from Avatar dropdown
  const handleOpenMyProfile = () => {
    const myProfile = employees.find((e) => e.id === "EMP-001") || {
      id: activeUser?.id || "EMP-CURRENT",
      name: activeUser?.name || "Alex Morgan",
      role: activeUser?.role || "Lead Software Architect",
      department: activeUser?.department_name || "Engineering",
      email: activeUser?.email || "alex.morgan@dayflow.internal",
      phone: "+1 (555) 234-5678",
      status: isCheckedIn ? "present" : "absent",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      location: "Floor 4 - Tech Bay A",
      joinedDate: "Mar 2022",
    };
    setSelectedEmployee(myProfile);
    setIsCreateMode(false);
    setIsCurrentUserProfile(true);
    setIsModalOpen(true);
  };

  // Save / Update Employee
  const handleSaveEmployee = (empData: MockEmployee) => {
    if (isCreateMode) {
      setEmployees((prev) => [empData, ...prev]);
    } else {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === empData.id ? empData : emp))
      );
    }
  };

  // Filtered Employees List
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDept =
        selectedDepartment === "All Departments" || emp.department === selectedDepartment;
      const matchesSearch =
        searchTerm === "" ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [employees, selectedDepartment, searchTerm]);

  // Quick Stats
  const employeeStats = useMemo(() => {
    return {
      total: employees.length,
      present: employees.filter((e) => e.status === "present").length,
      onLeave: employees.filter((e) => e.status === "on_leave").length,
      absent: employees.filter((e) => e.status === "absent").length,
    };
  }, [employees]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Top Navigation & Systray Header */}
      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCheckedIn={isCheckedIn}
        checkInTime={checkInTime}
        onToggleCheckIn={handleToggleCheckIn}
        onOpenMyProfile={handleOpenMyProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
        <div>
          
          {/* TAB 1: EMPLOYEES DIRECTORY (Primary View from Wireframe) */}
          {activeTab === "employees" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Action Bar (NEW button, Search Input, Department Chips) */}
              <ActionBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                onNewEmployee={handleOpenNewEmployee}
                employeeStats={employeeStats}
              />

              {/* 3-Column Responsive Grid of Employee Cards (Exact Wireframe layout) */}
              {filteredEmployees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard
                      key={employee.id}
                      employee={employee}
                      onSelect={handleSelectEmployee}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400 text-xl">
                    🔍
                  </div>
                  <h3 className="text-lg font-semibold text-white">No employees found</h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    No records match "{searchTerm}" in {selectedDepartment}. Try clearing your search or filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedDepartment("All Departments");
                    }}
                    className="px-4 py-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ATTENDANCE RECORDS */}
          {activeTab === "attendance" && (
            <div className="animate-in fade-in duration-150">
              <AttendanceView
                records={attendanceRecords}
                isCheckedIn={isCheckedIn}
                checkInTime={checkInTime}
                onToggleCheckIn={handleToggleCheckIn}
              />
            </div>
          )}

          {/* TAB 3: TIME OFF MANAGEMENT */}
          {activeTab === "time_off" && (
            <div className="animate-in fade-in duration-150">
              <TimeOffView
                requests={timeOffRequests}
                onRequestTimeOff={(newReq) => setTimeOffRequests((prev) => [newReq, ...prev])}
              />
            </div>
          )}

        </div>

        {/* Bottom Settings Link (From Wireframe Diagram) */}
        <div className="pt-10 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900 mt-12">
          <button
            onClick={() => toast("DayFlow Workspace Settings & Configuration", { icon: "⚙️" })}
            className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </button>
          <span>DayFlow v1.0 • Enterprise Workspace</span>
        </div>
      </main>

      {/* Employee Modal (Detail View, Edit, & New Employee Creation) */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
        isCreateMode={isCreateMode}
        onSave={handleSaveEmployee}
        isCurrentUserProfile={isCurrentUserProfile}
      />

    </div>
  );
}
