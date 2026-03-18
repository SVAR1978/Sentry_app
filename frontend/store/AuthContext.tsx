import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, Permission, ROLES, User } from "../types/rbac";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "@sentryapp:user",
  TOKEN: "@sentryapp:token",
  REMEMBER_ME: "@sentryapp:remember_me",
};

// Mock user data - replace with actual API calls
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@gmail.com",
    name: "John Administrator",
    role: ROLES[0], // admin
    avatar: "https://avatar.iran.liara.run/public/1",
    department: "IT",
  },
  {
    id: "2",
    email: "user@gmail.com",
    name: "Mike User",
    role: ROLES[1], // user
    avatar: "https://avatar.iran.liara.run/public/3",
    department: "Sales",
  },
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

      console.log("Loading user from storage:", { savedUser, token }); // Debug log

      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
      // Clear corrupted data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REMEMBER_ME,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      const foundUser = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!foundUser || password !== "password123") {
        throw new Error("Invalid email or password");
      }

      // Generate mock token
      const token = `mock_token_${foundUser.id}_${Date.now()}`;

      // Always save to storage to persist login state
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
      }

      setUser(foundUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REMEMBER_ME,
      ]);
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;

    return user.role.permissions.some(
      (permission: Permission) =>
        permission.resource === resource &&
        (permission.action === action || permission.action === "manage"),
    );
  };

  const hasRole = (role: string): boolean => {
    return user?.role.name === role;
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);

      // Update storage
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    role: user?.role.name || null,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };
