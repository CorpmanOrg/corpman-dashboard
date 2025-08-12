"use client";

import { ReactNode, FC, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
// import { logoutFn } from "@/utils/ApiFactory/auth";
import { SidebarMenuInit } from "@/constants/data";
import { logUserOut } from "@/utils/logout/logout";

type Category = "people" | "financials" | "records";

interface SidebarCategoryProps {
  icon: ReactNode;
  label: string;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

interface SidebarSubItemProps {
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
  children?: ReactNode;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
  onClick: () => void;
  children?: ReactNode;
}

function SidebarCategory({ icon, label, isCollapsed, isExpanded, onToggle, children }: SidebarCategoryProps) {
  const categoryHeader = (
    <div
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover: bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400`}
      onClick={onToggle}
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center p-2 w-6 h-6">{icon}</div>
        {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
      </div>
      {!isCollapsed && <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />}
    </div>
  );

  return (
    <div className="space-y-1">
      {isCollapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{categoryHeader}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
          >
            {label}
          </TooltipContent>
        </Tooltip>
      ) : (
        categoryHeader
      )}
      {isExpanded && <div className={`pl-3 ${isCollapsed ? "pl-0" : ""}`}>{children}</div>}
    </div>
  );
}

function SidebarSubItem({ label, isCollapsed, isActive, onClick }: SidebarSubItemProps) {
  if (isCollapsed) return null;

  return (
    <div
      className={`flex items-center p-2 pl-8 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] text-white dark:from-green-600 dark:to-green-500"
          : "text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400"
      }`}
      onClick={onClick}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
}

function SidebarItem({ icon, label, isCollapsed, isActive = false, onClick = () => {} }: SidebarItemProps) {
  const content = (
    <div
      className={`flex items-center p-2 rounded-md transition-colors cursor-pointer ${
        isActive
          ? "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] text-white dark:from-green-600 dark:to-green-500"
          : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center p-2 w-6 h-6">{icon}</div>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white dark:bg-gray-800 text-gray-100 border border-gray-200 dark:border-gray-700"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function SideNav() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedCategories, setExpandedCategories] = useState(["people"]);
  const { user, userRoles, userLoggedData } = useAuth();

  const toggleCategory = (category: Category) => {
    setExpandedCategories((prevS) =>
      prevS.includes(category) ? prevS.filter((c) => c !== category) : [...prevS, category]
    );
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <h1
              className={`text-2xl font-bold text-[#0e4430] dark:text-green-400 ${
                isSidebarCollapsed ? "hidden" : "block"
              }`}
            >
              Corp
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-[#0e4430] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <TooltipProvider>
            <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
              {SidebarMenuInit.map((sideMenu) => {
                if (sideMenu.type === "item") {
                  return (
                    <SidebarItem
                      key={sideMenu.key}
                      icon={sideMenu.icon}
                      label={sideMenu.label}
                      isCollapsed={isSidebarCollapsed}
                      isActive={activeItem === sideMenu.key}
                      onClick={() => {
                        console.log("I am clicked");
                        if (sideMenu.key === "logout") logUserOut();
                        // if (sideMenu.key === "logout") logout();
                        else setActiveItem(sideMenu.key);
                      }}
                    />
                  );
                }

                if (sideMenu.type === "category") {
                  return (
                    <SidebarCategory
                      key={sideMenu.key}
                      icon={sideMenu.icon}
                      label={sideMenu.label}
                      isCollapsed={isSidebarCollapsed}
                      isExpanded={expandedCategories.includes(sideMenu.key)}
                      onToggle={() => toggleCategory(sideMenu.key as Category)}
                    >
                      {sideMenu.children?.map((child) => (
                        <SidebarSubItem
                          key={child.key}
                          label={child.label}
                          isCollapsed={isSidebarCollapsed}
                          isActive={activeItem === child.key}
                          onClick={() => setActiveItem(child.key)}
                        />
                      ))}
                    </SidebarCategory>
                  );
                }

                return null;
              })}
            </nav>
          </TooltipProvider>
        </aside>
      </div>
    </TooltipProvider>
  );
}
