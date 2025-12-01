import { useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = "better-sleep-user";
const ONBOARDING_KEY = "better-sleep-onboarding-completed";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email === email) {
        setUser(parsedUser);
        return true;
      }
    }
    
    // For demo: create user if doesn't exist
    const newUser: User = {
      email,
      name: email.split("@")[0],
      hasCompletedOnboarding: localStorage.getItem(ONBOARDING_KEY) === "true",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newUser: User = {
      email,
      name,
      hasCompletedOnboarding: false,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const completeOnboarding = () => {
    // Get current user from state or localStorage
    const currentUser = user || (() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return {
            email: '',
            name: '',
            hasCompletedOnboarding: false,
          };
        }
      }
      return {
        email: '',
        name: '',
        hasCompletedOnboarding: false,
      };
    })();
    
    const updatedUser = { ...currentUser, hasCompletedOnboarding: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    localStorage.setItem(ONBOARDING_KEY, "true");
    setUser(updatedUser);
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    completeOnboarding,
    isAuthenticated: !!user,
  };
}

