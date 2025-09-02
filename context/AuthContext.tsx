"use-client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { StorageUtil } from "@/utils/StorageUtil";

interface User {
  id: string | undefined;
  name: string | undefined;
  email: string | undefined;
  role: string | undefined;
}

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
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
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
  userRoles: null,
  isSuperAdmin: "superAdmin",
  isAdmin: "admin",
  isMemberAdmin: "memberAdmin",
  isMember: "member",
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoggedData, setUserLoggedData] = useState<LogData | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  // const [userLoggedLoading, setUserLoggedLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

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
      let storedData = StorageUtil.getSessionItem<LogData>("logData");

      if (!storedData && data?.organization) {
        StorageUtil.setSessionItem("logData", data);
        storedData = data;
      }

      const roleAccess = userData?.role;

      if (userData && storedData) {
        setUser({
          id: storedData?.organization.id,
          name: storedData?.organization.name,
          email: storedData?.organization.email,
          role: userData?.role,
        });
        setUserLoggedData(storedData);
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

  return (
    <AuthContext.Provider value={{ user, loading, refetchUser: getUser, userLoggedData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
