"use-client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StorageUtil } from "@/utils/StorageUtil";
import { UserData } from "@/types/types";

type LoggedData = {
  id: string;
  email: string;
  name: string;
  address: string;
};

interface LogData {
  message: string;
  token: string;
  organization: LoggedData;
}

type ActiveContext = "member" | "org_admin";

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
  selectedOrgId: string | null;
  currentRole: string | null;
  currentOrgId: string | null;
  setSelectedOrgId: (id: string) => void;
  selectedOrganization: any | null;
  userRoles?: string[] | null;
  isSuperAdmin?: String;
  isAdmin?: String;
  isMemberAdmin?: String;
  isMember?: String;
  userLoggedData?: LogData | null;
  // Active Context (NEW)
  activeContext: ActiveContext;
  activeOrgId: string | null;
  hasAdminRole: boolean;
  switchToMember: () => void;
  switchToOrg: (orgId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  refetchUser: async () => {},
  selectedOrgId: null,
  currentRole: null,
  currentOrgId: null,
  setSelectedOrgId: () => {},
  selectedOrganization: null,
  userRoles: null,
  isSuperAdmin: "superAdmin",
  isAdmin: "admin",
  isMemberAdmin: "memberAdmin",
  isMember: "member",
  // Active Context defaults
  activeContext: "member",
  activeOrgId: null,
  hasAdminRole: false,
  switchToMember: () => {},
  switchToOrg: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoggedData, setUserLoggedData] = useState<LogData | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Active Context State (NEW)
  const [activeContext, setActiveContext] = useState<ActiveContext>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("activeContext");
      return (stored as ActiveContext) || "member";
    }
    return "member";
  });

  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      return localStorage.getItem("activeOrgId");
    }
    return null;
  });

  const getUser = useCallback(async () => {
    if (isLoggedOut) return;
    setLoading(true);
    try {
      const res = await fetch("/api/userAuth", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        setUserLoggedData(null);
        return;
      }

      const data = await res.json();
      const userData = data?.user ? JSON.parse(atob(data.user?.split(".")[1])) : null;
      let storedData = StorageUtil.getSessionItem<UserData>("logData");
      // console.log("User Auth Data: ", {userData, storedData });

      if (!storedData && data?.organization) {
        StorageUtil.setSessionItem("logData", data);
        storedData = data;
      }

      const roleAccess = userData?.role;

      if (userData && storedData) {
        setUser(storedData);
      }
    } catch (error) {
      setUser(null);
      setUserLoggedData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user?.user?.organizations?.length && !selectedOrgId) {
      setSelectedOrgId(user.user.organizations[0].organizationId);
    }
  }, [user, selectedOrgId]);

  const selectedOrganization = user?.user?.organizations?.find((org) => org.organizationId === selectedOrgId) || null;

  const currentRole = selectedOrganization?.role || null;
  const currentOrgId = selectedOrganization?.organizationId || null;

  // Parse hasAdminRole from role string (e.g., "org_admin,member" or "member")
  const hasAdminRole = currentRole?.includes("org_admin") ?? false;

  // Switch to Member Context
  const switchToMember = useCallback(() => {
    setActiveContext("member");
    setActiveOrgId(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeContext", "member");
      localStorage.removeItem("activeOrgId");
    }
    // Always redirect to dashboard on context switch
    router.push("/admin/dashboard");
  }, [router]);

  // Switch to Organization Context
  const switchToOrg = useCallback(
    (orgId: string) => {
      setActiveContext("org_admin");
      setActiveOrgId(orgId);
      if (typeof window !== "undefined") {
        localStorage.setItem("activeContext", "org_admin");
        localStorage.setItem("activeOrgId", orgId);
      }
      // Always redirect to dashboard on context switch
      router.push("/admin/dashboard");
    },
    [router]
  );

  // Set default context when user logs in (admins default to org_admin)
  useEffect(() => {
    if (user && currentRole) {
      // Only set default if not already in localStorage
      const storedContext = typeof window !== "undefined" ? localStorage.getItem("activeContext") : null;

      if (!storedContext) {
        if (currentRole.includes("org_admin") && currentOrgId) {
          switchToOrg(currentOrgId);
        } else {
          switchToMember();
        }
      } else {
        // Sync state with localStorage on mount
        if (storedContext === "org_admin" && currentOrgId) {
          setActiveContext("org_admin");
          const storedOrgId = localStorage.getItem("activeOrgId");
          if (storedOrgId) {
            setActiveOrgId(storedOrgId);
          }
        }
      }
    }
  }, [user, currentRole, currentOrgId, switchToOrg, switchToMember]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refetchUser: getUser,
        selectedOrgId,
        setSelectedOrgId,
        selectedOrganization,
        userLoggedData,
        currentRole,
        currentOrgId,
        // Active Context values
        activeContext,
        activeOrgId,
        hasAdminRole,
        switchToMember,
        switchToOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
