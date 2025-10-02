"use-client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
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
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userLoggedData, setUserLoggedData] = useState<LogData | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  // const [userLoggedLoading, setUserLoggedLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
