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
  const [loading, setLoading] = useState<boolean>(true); // Start with true to check auth on mount
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Active Context State (NEW)
  const [activeContext, setActiveContext] = useState<ActiveContext>(() => {
    // 🔒 Don't load from localStorage if on auth page or no cookie
    if (typeof window !== "undefined") {
      const isAuthPage = window.location.pathname.startsWith("/auth");
      const isLoggingOut = sessionStorage.getItem("__logging_out") === "true";

      if (isAuthPage || isLoggingOut) {
        // Clear any stale localStorage data
        localStorage.removeItem("activeContext");
        localStorage.removeItem("activeOrgId");
        return "member";
      }

      // Check if user has valid auth cookie before trusting localStorage
      const cookies = document.cookie.split(";");
      const hasAuthCookie = cookies.some((c) => c.trim().startsWith("myUserToken="));

      if (!hasAuthCookie) {
        // No auth cookie - clear stale localStorage
        localStorage.removeItem("activeContext");
        localStorage.removeItem("activeOrgId");
        return "member";
      }

      const stored = localStorage.getItem("activeContext");
      return (stored as ActiveContext) || "member";
    }
    return "member";
  });

  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => {
    // 🔒 Don't load from localStorage if on auth page
    if (typeof window !== "undefined") {
      const isAuthPage = window.location.pathname.startsWith("/auth");
      const isLoggingOut = sessionStorage.getItem("__logging_out") === "true";

      if (isAuthPage || isLoggingOut) {
        return null;
      }

      // Check if user has valid auth cookie before trusting localStorage
      const cookies = document.cookie.split(";");
      const hasAuthCookie = cookies.some((c) => c.trim().startsWith("myUserToken="));

      if (!hasAuthCookie) {
        return null;
      }

      const stored = localStorage.getItem("activeOrgId");
      return stored;
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
        // 🔒 Clear context and localStorage on auth failure
        setActiveContext("member");
        setActiveOrgId(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("activeContext");
          localStorage.removeItem("activeOrgId");
        }
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
      // 🔒 Clear context and localStorage on error
      setActiveContext("member");
      setActiveOrgId(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("activeContext");
        localStorage.removeItem("activeOrgId");
      }
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
    // 🔒 Only write to localStorage if we have an authenticated user and not logging out
    if (typeof window !== "undefined" && !isLoggedOut) {
      const isLoggingOut = sessionStorage.getItem("__logging_out") === "true";
      if (!isLoggingOut) {
        localStorage.setItem("activeContext", "member");
        localStorage.removeItem("activeOrgId");
      }
    }
    // Always redirect to dashboard on context switch
    router.push("/admin/dashboard");
  }, [router, isLoggedOut]);

  // Switch to Organization Context
  const switchToOrg = useCallback(
    (orgId: string) => {
      setActiveContext("org_admin");
      setActiveOrgId(orgId);
      // 🔒 Only write to localStorage if we have an authenticated user and not logging out
      if (typeof window !== "undefined" && !isLoggedOut) {
        const isLoggingOut = sessionStorage.getItem("__logging_out") === "true";
        if (!isLoggingOut) {
          localStorage.setItem("activeContext", "org_admin");
          localStorage.setItem("activeOrgId", orgId);
        }
      }
      // Always redirect to dashboard on context switch
      router.push("/admin/dashboard");
    },
    [router, isLoggedOut],
  );

  // Set default context when user logs in (admins default to org_admin)
  useEffect(() => {
    // 🔒 Don't set context if logging out or on auth page
    if (isLoggedOut) return;
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/auth")) return;

    if (user && currentRole) {
      const storedContext = typeof window !== "undefined" ? localStorage.getItem("activeContext") : null;

      // 🔒 SECURITY FIX: Validate stored context against user's actual role
      const hasAdminAccess = currentRole.includes("org_admin");

      if (!storedContext) {
        // No stored context - set default based on role
        if (hasAdminAccess && currentOrgId) {
          switchToOrg(currentOrgId);
        } else {
          switchToMember();
        }
      } else {
        // Stored context exists - validate it matches user's permissions
        if (storedContext === "org_admin") {
          // User wants org_admin context - check if they actually have the role
          if (hasAdminAccess && currentOrgId) {
            // Valid: User has org_admin role
            setActiveContext("org_admin");
            const storedOrgId = localStorage.getItem("activeOrgId");
            if (storedOrgId) {
              setActiveOrgId(storedOrgId);
            }
          } else {
            // Invalid: User doesn't have org_admin role but context says they do
            // This is the bug - reset to member
            console.warn("⚠️ Clearing invalid org_admin context for non-admin user");
            switchToMember();
          }
        } else {
          // Context is "member" - always valid
          setActiveContext("member");
          setActiveOrgId(null);
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
