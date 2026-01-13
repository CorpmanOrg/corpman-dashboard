"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Building2, ChevronDown } from "lucide-react";

export function ContextSwitcher() {
  const { activeContext, hasAdminRole, switchToMember, switchToOrg, selectedOrganization, user } = useAuth();
  const { toast } = useToast();

  // Don't show switcher if user is not an admin
  if (!hasAdminRole) {
    return null;
  }

  const organizations = user?.user?.organizations?.filter((org) => org.role.includes("org_admin")) || [];

  const handleSwitchToMember = () => {
    switchToMember();
    toast({
      title: "Switched to Personal Account",
      description: "Redirecting to dashboard...",
      duration: 2500,
    });
  };

  const handleSwitchToOrg = (orgId: string, orgName: string) => {
    switchToOrg(orgId);
    toast({
      title: "Switched to Admin Account",
      description: `Viewing ${orgName} as administrator. Redirecting to dashboard...`,
      duration: 2500,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {activeContext === "member" ? (
            <>
              <User className="h-4 w-4" />
              <span>Personal Account</span>
            </>
          ) : (
            <>
              <Building2 className="h-4 w-4" />
              <span>Admin Account</span>
            </>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Context</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSwitchToMember} className="flex items-center gap-2 cursor-pointer">
          <User className="h-4 w-4" />
          <span>Personal Account</span>
          {activeContext === "member" && <span className="ml-auto text-xs text-blue-500">Active</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.organizationId}
            onClick={() => handleSwitchToOrg(org.organizationId, org.organizationName)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Building2 className="h-4 w-4" />
            <span>{org.organizationName}</span>
            {activeContext === "org_admin" && selectedOrganization?.organizationId === org.organizationId && (
              <span className="ml-auto text-xs text-blue-500">Active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
