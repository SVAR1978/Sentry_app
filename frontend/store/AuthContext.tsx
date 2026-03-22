import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, Permission, ROLES, User } from "../types/rbac";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "@sentryapp:user",
  TOKEN: "@sentryapp:token",
  REMEMBER_ME: "@sentryapp:remember_me",
};

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

  const signup = async (name: string, email: string, phone: string, password: string, role: string) => {
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      // Optionally auto-login the user into the app right after signing up
      const userRoleStr = data.user.role.toLowerCase();
      const frontendRoleObj = ROLES.find((r) => r.name === userRoleStr) || ROLES[1];

      const authenticatedUser: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.name,
        role: frontendRoleObj,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authenticatedUser));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);

      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const login = async (email: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      const userRoleStr = data.user.role.toLowerCase();
      const frontendRoleObj = ROLES.find((r) => r.name === userRoleStr) || ROLES[1];

      const authenticatedUser: User = {
        id: data.user.id.toString(),
        email: data.user.email,
        name: data.user.name,
        role: frontendRoleObj,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authenticatedUser));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);

      if (rememberMe) {
        await AsyncStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "true");
      }

      setUser(authenticatedUser);
      return authenticatedUser;
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
    signup,
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
