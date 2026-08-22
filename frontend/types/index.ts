// Custom TypeScript interfaces and types for the application

export interface User {
  id: string;
  email: string;
  name?: string;
  uid?: string;
  employee_id?: string;
  role?: string;
  department_name?: string;
  departments?: { name: string } | null;
  [key: string]: any;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
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
}


