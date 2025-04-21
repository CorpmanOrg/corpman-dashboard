"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  Menu,
  Settings,
  Users,
  LogOut,
  Bell,
  User,
  ChevronLeft,
  Gift,
  Megaphone,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChart, PieChartComponent, ActivityMiniChart } from "./dashboard-charts"
import { ThemeToggle } from "./theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")
  const [expandedCategories, setExpandedCategories] = useState(["people"])

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
            isSidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <h1
              className={`text-2xl font-bold text-[#0e4430] dark:text-green-400 ${isSidebarCollapsed ? "hidden" : "block"}`}
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
              {/* Dashboard - standalone item */}
              <SidebarItem
                icon={<Home />}
                label="Dashboard"
                isCollapsed={isSidebarCollapsed}
                isActive={activeItem === "dashboard"}
                onClick={() => setActiveItem("dashboard")}
              />

              {/* People Management category */}
              <SidebarCategory
                icon={<Users />}
                label="People Management"
                isCollapsed={isSidebarCollapsed}
                isExpanded={expandedCategories.includes("people")}
                onToggle={() => toggleCategory("people")}
              >
                <SidebarSubItem
                  label="Members"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "members"}
                  onClick={() => setActiveItem("members")}
                />
                <SidebarSubItem
                  label="Exited Members"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "exited-members"}
                  onClick={() => setActiveItem("exited-members")}
                />
                <SidebarSubItem
                  label="Dispute"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "dispute"}
                  onClick={() => setActiveItem("dispute")}
                />
                <SidebarSubItem
                  label="Profile"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "profile"}
                  onClick={() => setActiveItem("profile")}
                />
              </SidebarCategory>

              {/* Financials category */}
              <SidebarCategory
                icon={<DollarSign />}
                label="Financials"
                isCollapsed={isSidebarCollapsed}
                isExpanded={expandedCategories.includes("financials")}
                onToggle={() => toggleCategory("financials")}
              >
                <SidebarSubItem
                  label="Contributions"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "contributions"}
                  onClick={() => setActiveItem("contributions")}
                />
                <SidebarSubItem
                  label="Withdrawals"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "withdrawals"}
                  onClick={() => setActiveItem("withdrawals")}
                />
                <SidebarSubItem
                  label="Loans"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "loans"}
                  onClick={() => setActiveItem("loans")}
                />
                <SidebarSubItem
                  label="Investments"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "investments"}
                  onClick={() => setActiveItem("investments")}
                />
                <SidebarSubItem
                  label="Welfare & Support"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "welfare"}
                  onClick={() => setActiveItem("welfare")}
                />
              </SidebarCategory>

              {/* Records category */}
              <SidebarCategory
                icon={<FileText />}
                label="Records"
                isCollapsed={isSidebarCollapsed}
                isExpanded={expandedCategories.includes("records")}
                onToggle={() => toggleCategory("records")}
              >
                <SidebarSubItem
                  label="Minutes of Meetings"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "minutes"}
                  onClick={() => setActiveItem("minutes")}
                />
                <SidebarSubItem
                  label="Reporting"
                  isCollapsed={isSidebarCollapsed}
                  isActive={activeItem === "reporting"}
                  onClick={() => setActiveItem("reporting")}
                />
              </SidebarCategory>

              {/* Settings - standalone item */}
              <SidebarItem
                icon={<Settings />}
                label="Settings"
                isCollapsed={isSidebarCollapsed}
                isActive={activeItem === "settings"}
                onClick={() => setActiveItem("settings")}
              />

              {/* Logout - standalone item */}
              <SidebarItem
                icon={<LogOut />}
                label="Logout"
                isCollapsed={isSidebarCollapsed}
                onClick={() => console.log("Logout clicked")}
              />
            </nav>
          </TooltipProvider>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#f8faf8] dark:bg-gray-950">
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

          <div className="flex-1 overflow-y-auto">
            {/* Welcome Banner */}
            <div className="p-6 bg-gradient-to-r from-[#e7f7e7] to-[#f0f9f0] dark:from-green-900/20 dark:to-green-800/20 border-b border-green-100 dark:border-green-900/30">
              <h2 className="text-lg font-medium text-[#0e4430] dark:text-green-400">Welcome back, Admin</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your cooperative today.
              </p>
            </div>

            {/* Statistics Cards with Gradient */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              <StatCard title="Members" value="1,250" icon={<Users className="h-6 w-6" />} />
              <StatCard title="Contributions" value="150" icon={<DollarSign className="h-6 w-6" />} />
              <StatCard title="Loans" value="456" icon={<CreditCard className="h-6 w-6" />} />
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow dark:shadow-green-900/10">
                <div className="bg-gradient-to-r from-[#5aed5f] to-[#0e4430] text-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Overall Activity</p>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div className="h-[60px]">
                    <ActivityMiniChart />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
                  <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">Activity</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        This Month <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>This Week</DropdownMenuItem>
                      <DropdownMenuItem>This Month</DropdownMenuItem>
                      <DropdownMenuItem>This Year</DropdownMenuItem>
                      <DropdownMenuItem>All Time</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
                  <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">Breakdown</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        By Category <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>By Category</DropdownMenuItem>
                      <DropdownMenuItem>By Status</DropdownMenuItem>
                      <DropdownMenuItem>By Department</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <PieChartComponent />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities and Adverts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Recent Activities */}
              <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600">
                <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
                  <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">
                    Recent Activities
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex items-start p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                      >
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                          <Users className="h-5 w-5 text-[#19d21f] dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-gray-200">New member registered</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Adverts Section */}
              <AdvertsCarousel />
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}

function SidebarCategory({ icon, label, isCollapsed, isExpanded, onToggle, children }) {
  const categoryHeader = (
    <div
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400`}
      onClick={onToggle}
    >
      <div className="flex items-center">
        <div className="flex items-center justify-center w-6 h-6">{icon}</div>
        {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
      </div>
      {!isCollapsed && <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />}
    </div>
  )

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
  )
}

function SidebarSubItem({ label, isCollapsed, isActive, onClick }) {
  if (isCollapsed) return null

  return (
    <div
      className={`flex items-center p-2 pl-8 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] text-white dark:from-green-600 dark:to-green-500"
          : "text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400"
      }`}
      onClick={onClick}
    >
      <span className="text-sm">{label}</span>
    </div>
  )
}

function SidebarItem({ icon, label, isCollapsed, isActive = false, onClick = () => {} }) {
  const content = (
    <div
      className={`flex items-center p-2 rounded-md transition-colors cursor-pointer ${
        isActive
          ? "bg-gradient-to-r from-[#19d21f] to-[#5aed5f] text-white dark:from-green-600 dark:to-green-500"
          : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-[#19d21f] dark:hover:text-green-400"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-6 h-6">{icon}</div>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </div>
  )

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

function StatCard({ title, value, icon }) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 dark:shadow-green-900/10 dark:bg-gray-900">
      <div className="p-4 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-gray-200">{value}</h3>
          </div>
          <div className="bg-gradient-to-r from-[#19d21f] to-[#5aed5f] dark:from-green-600 dark:to-green-500 p-3 rounded-full text-white">
            {icon}
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 dark:border-gray-800 p-3 bg-[#f9fdf9] dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-[#19d21f] dark:hover:text-green-400 cursor-pointer transition-colors">
          <span>View details</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Card>
  )
}

function AdvertsCarousel() {
  const [currentAdvert, setCurrentAdvert] = useState(0)

  const adverts = [
    {
      title: "Special Loan Offer",
      description: "Get up to 5% discount on new loans this month. Limited time offer!",
      icon: <Gift className="h-8 w-8" />,
      bgColor: "from-purple-500 to-indigo-600",
      buttonText: "Apply Now",
    },
    {
      title: "Upcoming Webinar",
      description: "Join our financial planning webinar on June 15th at 3 PM.",
      icon: <Megaphone className="h-8 w-8" />,
      bgColor: "from-amber-500 to-orange-600",
      buttonText: "Register",
    },
    {
      title: "New Investment Options",
      description: "Explore our new high-yield investment opportunities starting from $500.",
      icon: <Lightbulb className="h-8 w-8" />,
      bgColor: "from-cyan-500 to-blue-600",
      buttonText: "Learn More",
    },
  ]

  // Auto-rotate adverts every 20 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdvert((prev) => (prev + 1) % adverts.length)
    }, 20000)

    return () => clearInterval(interval)
  }, [adverts.length])

  const goToAdvert = (index) => {
    setCurrentAdvert(index)
  }

  const nextAdvert = () => {
    setCurrentAdvert((prev) => (prev + 1) % adverts.length)
  }

  const prevAdvert = () => {
    setCurrentAdvert((prev) => (prev - 1 + adverts.length) % adverts.length)
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:border-t-green-600 overflow-hidden dark:shadow-green-900/10 dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
        <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">Announcements</CardTitle>
        <div className="flex space-x-1">
          {adverts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToAdvert(index)}
              className={`w-2 h-2 rounded-full ${currentAdvert === index ? "bg-[#19d21f] dark:bg-green-500" : "bg-gray-300 dark:bg-gray-700"}`}
              aria-label={`Go to advert ${index + 1}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="relative overflow-hidden">
          <div
            className={`p-6 bg-gradient-to-r ${adverts[currentAdvert].bgColor} text-white transition-all duration-500 ease-in-out`}
          >
            <div className="flex items-start">
              <div className="bg-white/20 p-3 rounded-full mr-4">{adverts[currentAdvert].icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2">{adverts[currentAdvert].title}</h3>
                <p className="mb-4 text-white/90">{adverts[currentAdvert].description}</p>
                <Button className="bg-white text-gray-800 hover:bg-gray-100">
                  {adverts[currentAdvert].buttonText}
                </Button>
              </div>
            </div>
          </div>

          <button
            onClick={prevAdvert}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-1 text-white transition-colors"
            aria-label="Previous advert"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextAdvert}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-1 text-white transition-colors"
            aria-label="Next advert"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3 bg-[#f9fdf9] dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Ad {currentAdvert + 1} of {adverts.length}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Rotates every 20 seconds</span>
        </div>
      </CardContent>
    </Card>
  )
}
