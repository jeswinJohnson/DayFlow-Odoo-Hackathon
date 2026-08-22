"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppContextType, ApiResponse, TestResult } from "@/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sample API test function.
   * Connects to backend API or processes data.
   */
  const test = async (): Promise<ApiResponse<TestResult>> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const result: ApiResponse<TestResult> = {
        success: true,
        message: "API test call executed successfully",
        data: {
          status: "API Connected & Operational",
          timestamp: new Date().toISOString(),
        },
      };
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        error,
        test,
        clearError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
