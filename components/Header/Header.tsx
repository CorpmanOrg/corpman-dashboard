"use client";

import { useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import { ContextSwitcher } from "../ContextSwitcher/ContextSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { logUserOut } from "@/utils/logout/logout";

export function Header() {
  const { user, selectedOrgId, setSelectedOrgId, refetchUser } = useAuth();
  const { setLoading } = useLoading();
  const [isSwitchingOrg, setIsSwitchingOrg] = useState(false);
  const myOrgs = user?.user?.organizations || [];
  const hasMultipleOrgs = myOrgs.length > 1;
  const hasSingleOrg = myOrgs.length === 1;
  const singleOrgName = hasSingleOrg ? myOrgs[0].organizationName : "";

  const handleOrgSwitch = async (newOrgId: string) => {
    if (newOrgId === selectedOrgId) return; // No change needed

    const orgName = myOrgs.find((org) => org.organizationId === newOrgId)?.organizationName || "organization";

    setIsSwitchingOrg(true);
    setLoading(true, `Switching to ${orgName}...`);

    try {
      // Update the selected organization
      setSelectedOrgId(newOrgId);

      // Refetch user data (this will trigger re-renders across the app)
      await refetchUser();

      // Add a small delay to allow React Query to refetch all queries
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error switching organization:", error);
    } finally {
      setIsSwitchingOrg(false);
      setLoading(false);
    }
  };

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
          <ContextSwitcher />
          <Button
            variant="ghost"
            size="icon"
            className="text-[#0e4430] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 relative h-8 w-8 sm:h-10 sm:w-10"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Single Organization - Show name directly, dropdown only for logout */}
          {hasSingleOrg && (
            <Select value={singleOrgName} onValueChange={(value) => value === "logout" && logUserOut()}>
              <SelectTrigger className="w-[120px] sm:w-[200px] text-[#0e4430] dark:text-green-400 text-xs sm:text-sm">
                <span className="truncate">{singleOrgName}</span>
              </SelectTrigger>
              <SelectContent>
                <div
                  className="px-4 py-2 text-xs sm:text-sm text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={logUserOut}
                >
                  Logout
                </div>
              </SelectContent>
            </Select>
          )}

          {/* Multiple Organizations - Show dropdown with all orgs */}
          {hasMultipleOrgs && (
            <Select
              value={selectedOrgId || ""}
              onValueChange={(value) => {
                if (value === "logout") {
                  logUserOut();
                } else {
                  handleOrgSwitch(value);
                }
              }}
              disabled={isSwitchingOrg}
            >
              <SelectTrigger className="w-[120px] sm:w-[200px] text-[#0e4430] dark:text-green-400 text-xs sm:text-sm">
                {isSwitchingOrg ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Switching...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select organization" />
                )}
              </SelectTrigger>
              <SelectContent>
                {myOrgs.map((org, idx) => (
                  <SelectItem key={idx} value={org.organizationId} className="text-xs sm:text-sm">
                    {org.organizationName}
                  </SelectItem>
                ))}
                <div
                  className="px-4 py-2 text-xs sm:text-sm text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={logUserOut}
                >
                  Logout
                </div>
              </SelectContent>
            </Select>
          )}

          {/* Fallback for users with no organizations - Show logout button */}
          {!hasSingleOrg && !hasMultipleOrgs && (
            <Select value="user-menu" onValueChange={(value) => value === "logout" && logUserOut()}>
              <SelectTrigger className="w-[120px] sm:w-[200px] text-[#0e4430] dark:text-green-400 text-xs sm:text-sm">
                <span className="truncate">{user?.user?.firstName || "User"}</span>
              </SelectTrigger>
              <SelectContent>
                <div
                  className="px-4 py-2 text-xs sm:text-sm text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={logUserOut}
                >
                  Logout
                </div>
              </SelectContent>
            </Select>
          )}
        </div>
      </header>
    </div>
  );
}
