// Custom TypeScript interfaces and types for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface TestResult {
  status: string;
  timestamp: string;
}

export interface AppContextType {
  isLoading: boolean;
  error: string | null;
  test: () => Promise<ApiResponse<TestResult>>;
  clearError: () => void;
}
