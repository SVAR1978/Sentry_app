export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  permissions?: Permission[];
}

export interface UserRole {
  id: string;
  name: "admin" | "user";
  displayName: string;
  icon: string;
  color: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: "create" | "read" | "update" | "delete" | "manage";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: "admin" | "user" | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  updateUser: (user: Partial<User>) => void;
}

export interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  requiredRole?: string[];
  requiredPermission?: { resource: string; action: string };
}

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  subValue?: string;
  icon: string;
  color: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export const ROLES: UserRole[] = [
  {
    id: "admin",
    name: "admin",
    displayName: "Administration",
    icon: "shield-crown",
    color: "#1E40AF",
    permissions: [
      {
        id: "user-manage",
        name: "Manage Users",
        resource: "users",
        action: "manage",
      },
      {
        id: "analytics-read",
        name: "View Analytics",
        resource: "analytics",
        action: "read",
      },
      {
        id: "settings-manage",
        name: "Manage Settings",
        resource: "settings",
        action: "manage",
      },
      {
        id: "reports-manage",
        name: "Manage Reports",
        resource: "reports",
        action: "manage",
      },
    ],
  },

  {
    id: "user",
    name: "user",
    displayName: "User",
    icon: "account",
    color: "#10B981",
    permissions: [
      {
        id: "profile-read",
        name: "View Profile",
        resource: "profile",
        action: "read",
      },
      {
        id: "profile-update",
        name: "Update Profile",
        resource: "profile",
        action: "update",
      },
      {
        id: "dashboard-read",
        name: "View Dashboard",
        resource: "dashboard",
        action: "read",
      },
    ],
  },
];
