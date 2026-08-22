// Custom TypeScript interfaces and types for the application

export type Role = 'admin' | 'employee' | 'emp';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
  role: Role;
  company_id?: number | string | null;
  company_name?: string | null;
  dept_id?: number | string | null;
  department_name?: string | null;
  designation?: string | null;
  must_change_password?: boolean;
  [key: string]: any;
}

export interface MyProfile {
  f_name: string;
  l_name: string;
  email: string;
  comp_name: string;
  dept_name: string | null;
  location: string | null;
  bio: string | null;
  p_email: string | null;
  dob: string | null;
  nationality: string | null;
  manager_name: string | null;
  skills: string[];
  certification: string[];
  gender: string | null;
  marital_status: string | null;
  doj: string | null;
  uan_no: string | null;
  pan_no: string | null;
  ifsc_code: string | null;
  bank_name: string | null;
  acc_number: string | null;
}

export interface EditProfile {
  location?: string | null;
  bio?: string | null;
  p_email?: string | null;
  dob?: string | null;
  nationality?: string | null;
  skills?: string[] | null;
  certification?: string[] | null;
  gender?: string | null;
  marital_status?: string | null;
  doj?: string | null;
  uan_no?: string | null;
  pan_no?: string | null;
  ifsc_code?: string | null;
  bank_name?: string | null;
  acc_number?: string | null;
}

export interface EmployeeDirectory {
  id?: string | null;
  name: string;
  f_name?: string | null;
  l_name?: string | null;
  designation?: string | null;
  dept?: string | null;
  email: string;
  phone?: string | null;
  bio?: string | null;
  location?: string | null;
}

export interface DepartmentOut {
  id: number | string;
  name: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  department_id: number | string;
  designation?: string | null;
  doj?: string | null;
}

export interface CreateUserResponse {
  id: string;
  employee_id: string;
  uid?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  password?: string | null;
  temporary_password?: string | null;
  phone?: string | null;
  department_id: number | string;
  designation?: string | null;
  doj?: string | null;
  company_id?: number | string | null;
  role?: string;
  must_change_password?: boolean;
  message?: string;
}

export interface CompanySignupData {
  companyName: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
  logoDataUrl?: string | null;
}

export interface AttendanceActionResponse {
  message: string;
  data?: any;
}

export interface AttendanceStatusResponse {
  employee_id: string;
  status?: string | null;
}

export interface AttendanceRecord {
  id?: string | number | null;
  user_id?: string | null;
  employee_name?: string | null;
  date?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  work_hours?: string | null;
  extra_hours?: string | null;
  status?: string | null;
  department?: string | null;
  [key: string]: any;
}

export interface GetAllAttendanceResponse {
  date: string;
  records: any[];
}

export interface UserDailyAttendanceResponse {
  employee_id: string;
  date: string;
  attendance?: any;
}

export interface AppContextType {
  activeUser: User | null;
  authLoading: boolean;
  setActiveUser: (user: User | null) => void;
  login: (identifier: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isRecoveryMode: boolean;
  setIsRecoveryMode: (value: boolean) => void;
  resetPassword: (identifier: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  myProfile: MyProfile | null;
  profileLoading: boolean;
  fetchMyProfile: () => Promise<MyProfile | null>;
  updateMyProfile: (data: EditProfile) => Promise<MyProfile | null>;
  directory: EmployeeDirectory[] | null;
  directoryLoading: boolean;
  fetchDirectory: () => Promise<EmployeeDirectory[] | null>;
  departments: DepartmentOut[] | null;
  departmentsLoading: boolean;
  fetchDepartments: () => Promise<DepartmentOut[] | null>;
  createUser: (data: CreateUserRequest) => Promise<CreateUserResponse | null>;
  isCheckedIn: boolean;
  checkInTime: string | null;
  attendanceStatus: string | null;
  attendanceLoading: boolean;
  checkIn: () => Promise<AttendanceActionResponse | null>;
  checkOut: () => Promise<AttendanceActionResponse | null>;
  toggleCheckIn: () => Promise<void>;
  fetchAttendanceStatus: () => Promise<AttendanceStatusResponse | null>;
  fetchUserDailyAttendance: (date?: string, employeeId?: string) => Promise<UserDailyAttendanceResponse | null>;
  fetchAllAttendance: (date?: string) => Promise<GetAllAttendanceResponse | null>;
  getDataFromServer: (endpoints: string) => Promise<any>;
  postDataToServer: (endpoints: string, body: any) => Promise<any>;
  patchDataToServer: (endpoints: string, body: any) => Promise<any>;
}
