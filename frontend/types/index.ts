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
  getDataFromServer: (endpoints: string) => Promise<any>;
  postDataToServer: (endpoints: string, body: any) => Promise<any>;
  patchDataToServer: (endpoints: string, body: any) => Promise<any>;
}



