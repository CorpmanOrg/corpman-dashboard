"use client";

import { Bell, User } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { logUserOut } from "@/utils/logout/logout";

export function Header() {
  const { user, selectedOrgId, setSelectedOrgId } = useAuth();
  const myOrgs = user && user.user.organizations;
  const organizationName = user && myOrgs?.length === 1 ? myOrgs[0].organizationName : "Select organization";
  // console.log("User's Organizations: ", { myOrgs, organizationName });
  // console.log("Header User Data: ", { user });

  return (
    <div>
      <header className="bg-[#f8faf8] dark:bg-gray-900 h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-medium text-[#0e4430] dark:text-green-400">
            {`Welcome back, ${user?.user?.firstName || "user"}`}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here's what's happening with your cooperative today.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-[#0e4430] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Select value={selectedOrgId || ""} onValueChange={setSelectedOrgId}>
            <SelectTrigger className="w-[200px] text-[#0e4430] dark:text-green-400">
              <SelectValue placeholder={organizationName || "Select Your Organization"} />
            </SelectTrigger>
            <SelectContent>
              {user?.user?.organizations?.map((org, idx) => (
                <SelectItem key={idx} value={org.organizationName}>
                  {org.organizationName} {/* Replace with org name if available */}
                </SelectItem>
              ))}
              <div className="px-4 py-2 text-sm text-red-600 cursor-pointer" onClick={logUserOut}>
                Logout
              </div>
            </SelectContent>
          </Select>
        </div>
      </header>
    </div>
  );
}
