// Custom TypeScript interfaces and types for the application

enum role {
  admin = "admin",
  emp = "emp"
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: role;
  [key: string]: any;
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


