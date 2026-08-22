export interface MockEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: "present" | "on_leave" | "absent";
  avatar: string;
  checkInTime?: string;
  location?: string;
  joinedDate?: string;
}

export interface MockAttendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours: string;
  status: "on_time" | "late" | "early_departure";
}

export interface MockTimeOff {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Annual Leave" | "Sick Leave" | "Personal" | "Maternity / Paternity";
  startDate: string;
  endDate: string;
  days: number;
  status: "approved" | "pending" | "rejected";
  reason: string;
}

export const INITIAL_EMPLOYEES: MockEmployee[] = [
  {
    id: "EMP-001",
    name: "Alex Morgan",
    role: "Lead Software Architect",
    department: "Engineering",
    email: "alex.morgan@dayflow.internal",
    phone: "+1 (555) 234-5678",
    status: "present",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    checkInTime: "08:45 AM",
    location: "Floor 4 - Tech Bay A",
    joinedDate: "Mar 2022",
  },
  {
    id: "EMP-002",
    name: "Sarah Chen",
    role: "Senior Product Designer",
    department: "Design",
    email: "sarah.chen@dayflow.internal",
    phone: "+1 (555) 345-6789",
    status: "present",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    checkInTime: "09:02 AM",
    location: "Floor 3 - Studio B",
    joinedDate: "Jan 2023",
  },
  {
    id: "EMP-003",
    name: "Marcus Vance",
    role: "DevOps & Cloud Engineer",
    department: "Engineering",
    email: "marcus.vance@dayflow.internal",
    phone: "+1 (555) 456-7890",
    status: "on_leave",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    location: "Remote",
    joinedDate: "Jun 2021",
  },
  {
    id: "EMP-004",
    name: "Elena Rostova",
    role: "VP of People & Culture",
    department: "Human Resources",
    email: "elena.r@dayflow.internal",
    phone: "+1 (555) 567-8901",
    status: "present",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    checkInTime: "08:30 AM",
    location: "Floor 2 - Executive",
    joinedDate: "Nov 2020",
  },
  {
    id: "EMP-005",
    name: "David Kim",
    role: "Backend Systems Developer",
    department: "Engineering",
    email: "david.kim@dayflow.internal",
    phone: "+1 (555) 678-9012",
    status: "absent",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    location: "Floor 4 - Tech Bay A",
    joinedDate: "Aug 2023",
  },
  {
    id: "EMP-006",
    name: "Olivia Thorne",
    role: "Growth & Marketing Director",
    department: "Marketing",
    email: "olivia.thorne@dayflow.internal",
    phone: "+1 (555) 789-0123",
    status: "present",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    checkInTime: "09:15 AM",
    location: "Floor 3 - Marketing Hub",
    joinedDate: "Feb 2022",
  },
  {
    id: "EMP-007",
    name: "Liam O'Connor",
    role: "Financial Analyst",
    department: "Finance",
    email: "liam.oc@dayflow.internal",
    phone: "+1 (555) 890-1234",
    status: "present",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    checkInTime: "08:50 AM",
    location: "Floor 2 - Finance Wing",
    joinedDate: "Oct 2022",
  },
  {
    id: "EMP-008",
    name: "Maya Lin",
    role: "UX Researcher",
    department: "Design",
    email: "maya.lin@dayflow.internal",
    phone: "+1 (555) 901-2345",
    status: "on_leave",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80",
    location: "Floor 3 - Studio B",
    joinedDate: "Apr 2023",
  },
  {
    id: "EMP-009",
    name: "Jordan Bell",
    role: "Security & Compliance Specialist",
    department: "Engineering",
    email: "jordan.bell@dayflow.internal",
    phone: "+1 (555) 012-3456",
    status: "absent",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    location: "Floor 4 - Tech Bay B",
    joinedDate: "Jan 2024",
  },
];

export const INITIAL_ATTENDANCE: MockAttendance[] = [
  {
    id: "ATT-101",
    employeeId: "EMP-001",
    employeeName: "Alex Morgan",
    date: "Today",
    checkIn: "08:45 AM",
    workHours: "5h 24m (In Progress)",
    status: "on_time",
  },
  {
    id: "ATT-102",
    employeeId: "EMP-002",
    employeeName: "Sarah Chen",
    date: "Today",
    checkIn: "09:02 AM",
    workHours: "5h 07m (In Progress)",
    status: "on_time",
  },
  {
    id: "ATT-103",
    employeeId: "EMP-004",
    employeeName: "Elena Rostova",
    date: "Today",
    checkIn: "08:30 AM",
    workHours: "5h 39m (In Progress)",
    status: "on_time",
  },
  {
    id: "ATT-104",
    employeeId: "EMP-006",
    employeeName: "Olivia Thorne",
    date: "Today",
    checkIn: "09:15 AM",
    workHours: "4h 54m (In Progress)",
    status: "late",
  },
  {
    id: "ATT-105",
    employeeId: "EMP-007",
    employeeName: "Liam O'Connor",
    date: "Today",
    checkIn: "08:50 AM",
    workHours: "5h 19m (In Progress)",
    status: "on_time",
  },
  {
    id: "ATT-106",
    employeeId: "EMP-001",
    employeeName: "Alex Morgan",
    date: "Yesterday",
    checkIn: "08:50 AM",
    checkOut: "05:40 PM",
    workHours: "8h 50m",
    status: "on_time",
  },
  {
    id: "ATT-107",
    employeeId: "EMP-002",
    employeeName: "Sarah Chen",
    date: "Yesterday",
    checkIn: "08:55 AM",
    checkOut: "05:30 PM",
    workHours: "8h 35m",
    status: "on_time",
  },
];

export const INITIAL_TIME_OFF: MockTimeOff[] = [
  {
    id: "TO-201",
    employeeId: "EMP-003",
    employeeName: "Marcus Vance",
    type: "Annual Leave",
    startDate: "Aug 20, 2026",
    endDate: "Aug 27, 2026",
    days: 7,
    status: "approved",
    reason: "Family vacation trip",
  },
  {
    id: "TO-202",
    employeeId: "EMP-008",
    employeeName: "Maya Lin",
    type: "Personal",
    startDate: "Aug 22, 2026",
    endDate: "Aug 24, 2026",
    days: 3,
    status: "approved",
    reason: "Personal appointment and travel",
  },
  {
    id: "TO-203",
    employeeId: "EMP-005",
    employeeName: "David Kim",
    type: "Sick Leave",
    startDate: "Aug 28, 2026",
    endDate: "Aug 29, 2026",
    days: 2,
    status: "pending",
    reason: "Doctor advised recovery rest",
  },
];

export const DEPARTMENTS = [
  "All Departments",
  "Engineering",
  "Design",
  "Human Resources",
  "Marketing",
  "Finance",
];
