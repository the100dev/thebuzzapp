"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { KeychainKeyTypes, KeychainSDK, Login } from "keychain-sdk";

interface User {
  username: string;
  publicKeys?: {
    posting?: string;
    active?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => void;
  checkKeychain: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkKeychain = async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    try {
      const keychain = new KeychainSDK(window);
      return await keychain.isKeychainInstalled();
    } catch (error) {
      return false;
    }
  };

  const login = async (username: string) => {
    const isInstalled = await checkKeychain();

    if (!isInstalled) {
      alert(
        "Hive Keychain extension not found. Please install it from the Chrome Web Store."
      );
      return;
    }

    setIsLoading(true);

    try {
      const keychain = new KeychainSDK(window);

      const loginData: Login = {
        username: username,
        // Message can by anthing
        message: JSON.stringify({ login: Date.now().toString() }),
        method: KeychainKeyTypes.posting,
        title: "Login to TheBuzzApp",
      };

      const loginResult = await keychain.login(loginData);

      if (loginResult.success) {
        const userData: User = {
          username: username,
        };

        setUser(userData);
        localStorage.setItem("hive_user", JSON.stringify(userData));
      } else {
        throw new Error(loginResult.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to authenticate with Hive Keychain. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hive_user");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("hive_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("hive_user");
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkKeychain,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
