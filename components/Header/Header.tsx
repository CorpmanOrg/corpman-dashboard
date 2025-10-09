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
      <header className="bg-[#f8faf8] dark:bg-gray-900 h-16 px-2 sm:px-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        {/* Left Section */}
        <div className="flex-1 min-w-0 pr-2">
          <h2 className="text-sm sm:text-lg font-medium text-[#0e4430] dark:text-green-400 truncate">
            {`Welcome back, ${user?.user?.firstName || "user"}`}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate hidden xs:block">
            Here's what's happening with your cooperative today.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-[#0e4430] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 relative h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Select value={selectedOrgId || ""} onValueChange={setSelectedOrgId}>
            <SelectTrigger className="w-[120px] sm:w-[200px] text-[#0e4430] dark:text-green-400 text-xs sm:text-sm">
              <SelectValue placeholder={organizationName || "Select Org"} />
            </SelectTrigger>
            <SelectContent>
              {user?.user?.organizations?.map((org, idx) => (
                <SelectItem key={idx} value={org.organizationName} className="text-xs sm:text-sm">
                  {org.organizationName}
                </SelectItem>
              ))}
              <div className="px-4 py-2 text-xs sm:text-sm text-red-600 cursor-pointer" onClick={logUserOut}>
                Logout
              </div>
            </SelectContent>
          </Select>
        </div>
      </header>
    </div>
  );
}
