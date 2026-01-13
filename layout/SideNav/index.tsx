"use client";

import { ReactNode, FC, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ChevronDown, Menu } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { SidebarMenuInit } from "@/constants/data";

type Category = "people" | "financials" | "records";

interface SidebarCategoryProps {
  icon: ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

interface SidebarSubItemProps {
  label: string;
  chref: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
  children?: ReactNode;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

function SidebarCategory({ icon, label, href, isCollapsed, isExpanded, onToggle, children }: SidebarCategoryProps) {
  const categoryHeader = (
    <div
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-gray-700 dark:text-gray-100 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400`}
      onClick={onToggle}
      // href={href}
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center p-1 w-8 h-8">{icon}</div>
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

function SidebarSubItem({ label, chref, isCollapsed, isActive, onClick }: SidebarSubItemProps) {
  if (isCollapsed) return null;

  return (
    <Link
      className={`flex items-center p-2 pl-8 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] text-white dark:from-green-600 dark:to-green-500"
          : "text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400"
      }`}
      onClick={onClick}
      href={chref}
    >
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function SidebarItem({ icon, label, href, isCollapsed, isActive = false, onClick = () => {} }: SidebarItemProps) {
  const content = (
    <Link
      className={`flex font-medium items-center p-2 rounded-md transition-colors cursor-pointer ${
        isActive
          ? "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] text-white dark:from-green-600 dark:to-green-500"
          : "text-gray-700 dark:text-gray-100 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400"
      }`}
      onClick={onClick}
      href={href}
    >
      <div className="flex items-center justify-center p-1 w-8 h-8">{icon}</div>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </Link>
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
  const pathname = usePathname();
  const { user, activeContext } = useAuth();

  // Deep clone utility for menu
  function deepCloneMenu(menu: typeof SidebarMenuInit): typeof SidebarMenuInit {
    return menu.map((item: (typeof SidebarMenuInit)[number]) => ({
      ...item,
      children: item.children ? item.children.map((c: (typeof item.children)[number]) => ({ ...c })) : undefined,
    }));
  }

  // Role-based menu filtering (no mutation)
  const adminMenu = deepCloneMenu(SidebarMenuInit).filter((item: (typeof SidebarMenuInit)[number]) => {
    if (item.type === "item") {
      return ["dashboard", "settings", "audit", "logout"].includes(item.key);
    }
    if (item.type === "category") {
      if (item.key === "people") {
        item.children = item.children?.filter(
          (c: (typeof item.children)[number]) => ["members", "createMembers"].includes(c.key)
          // ["members", "dispute"].includes(c.key)
        );
        return true;
      }
      if (item.key === "financials") {
        item.children = item.children?.filter(
          (c: (typeof item.children)[number]) => ["payments"].includes(c.key)
          // ["payments", "investments", "welfare"].includes(c.key)
        );
        return true;
      }
      if (item.key === "records") {
        item.children = item.children?.filter(
          (c: (typeof item.children)[number]) => ["statement", "myReports", "profile"].includes(c.key)
          // ["statement", "reporting", "minutes", "profile"].includes(c.key)
        );
        return true;
      }
    }
    return false;
  });

  const memberMenu = deepCloneMenu(SidebarMenuInit).filter((item: (typeof SidebarMenuInit)[number]) => {
    if (item.type === "item") {
      return ["dashboard", "logout"].includes(item.key);
    }
    if (item.type === "category") {
      if (item.key === "financials") {
        item.children = item.children?.filter((c: (typeof item.children)[number]) => ["transactions"].includes(c.key));
        return true;
      }
      if (item.key === "records") {
        item.children = item.children?.filter((c: (typeof item.children)[number]) =>
          ["minutes", "myReports", "profile", "history"].includes(c.key)
        );
        return true;
      }
    }
    return false;
  });

  const menuToRender = activeContext === "org_admin" ? adminMenu : memberMenu;

  // 🔥 FIX: Auto-detect active item based on pathname
  useEffect(() => {
    // Find the active item based on current pathname
    let foundActiveItem = "dashboard"; // Default

    menuToRender.forEach((item) => {
      if (item.type === "item" && pathname === item.href) {
        foundActiveItem = item.key;
      } else if (item.type === "category" && item.children) {
        item.children.forEach((child) => {
          if (pathname === child.chref) {
            foundActiveItem = child.key;
            // Auto-expand parent category when child is active
            setExpandedCategories((prev) =>
              prev.includes(item.key as Category) ? prev : [...prev, item.key as Category]
            );
          }
        });
      }
    });

    setActiveItem(foundActiveItem);
  }, [pathname, menuToRender]);

  const toggleCategory = (category: Category) => {
    setExpandedCategories((prevS) =>
      prevS.includes(category) ? prevS.filter((c) => c !== category) : [...prevS, category]
    );
  };

  return (
    <TooltipProvider>
      <aside
        className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        } flex flex-col h-screen`}
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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuToRender.map((sideMenu: (typeof SidebarMenuInit)[number]) => {
              if (sideMenu.type === "item" && typeof sideMenu.href === "string") {
                return (
                  <SidebarItem
                    key={sideMenu.key}
                    icon={sideMenu.icon}
                    label={sideMenu.label}
                    href={sideMenu.href}
                    isCollapsed={isSidebarCollapsed}
                    isActive={activeItem === sideMenu.key}
                    onClick={() => setActiveItem(sideMenu.key)}
                  />
                );
              }

              if (sideMenu.type === "category" && typeof sideMenu.href === "string") {
                return (
                  <SidebarCategory
                    key={sideMenu.key}
                    icon={sideMenu.icon}
                    label={sideMenu.label}
                    href={sideMenu.href}
                    isCollapsed={isSidebarCollapsed}
                    isExpanded={expandedCategories.includes(sideMenu.key)}
                    onToggle={() => toggleCategory(sideMenu.key as Category)}
                  >
                    {sideMenu.children?.map((child: (typeof sideMenu.children)[number]) => (
                      <SidebarSubItem
                        key={child.key}
                        label={child.label}
                        chref={child.chref}
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
    </TooltipProvider>
  );
}
