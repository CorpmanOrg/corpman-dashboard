"use client";

import { Bell, User } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";


export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 h-16 px-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold text-[#0e4430] dark:text-green-400">Admin Dashboard</h1>
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
        <Button
          variant="ghost"
          size="icon"
          className="text-[#0e4430] dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
