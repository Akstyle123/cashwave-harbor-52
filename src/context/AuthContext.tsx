
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, LoginParams, OTPVerificationParams } from "@/types";
import { loginAPI, verifyOTPAPI, logoutAPI } from "@/lib/api";
import { APP_ROUTES } from "@/config/constants";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (params: LoginParams) => Promise<boolean>;
  verifyOTP: (params: OTPVerificationParams) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("bankUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("bankUser");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (params: LoginParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginAPI(params);
      
      if (response.includes("OTP sent")) {
        toast.success("OTP sent to your email");
        return true;
      } else {
        setError(response);
        toast.error(response);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (params: OTPVerificationParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOTPAPI(params);
      
      if (response.includes("successful")) {
        // Set user data in context and localStorage
        const userData: User = {
          email: params.email,
          role: "admin" // Default to admin for now
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("bankUser", JSON.stringify(userData));
        
        toast.success("Login successful");
        navigate(APP_ROUTES.DASHBOARD);
        return true;
      } else {
        setError(response);
        toast.error(response);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "OTP verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (user?.email) {
        await logoutAPI({ email: user.email });
      }
    } catch (err) {
      console.error("Logout API Error:", err);
    } finally {
      // Clear user data regardless of API success
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("bankUser");
      setIsLoading(false);
      
      toast.success("Logged out successfully");
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        verifyOTP,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
