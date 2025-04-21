"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { useTheme } from "@/components/theme-provider"

// Sample data for the line chart
const activityData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 590 },
  { name: "Jun", value: 390 },
  { name: "Jul", value: 490 },
  { name: "Aug", value: 600 },
  { name: "Sep", value: 510 },
  { name: "Oct", value: 420 },
  { name: "Nov", value: 580 },
  { name: "Dec", value: 450 },
]

// Sample data for the pie chart
const breakdownData = [
  { name: "Category A", value: 35 },
  { name: "Category B", value: 25 },
  { name: "Category C", value: 20 },
  { name: "Category D", value: 15 },
  { name: "Category E", value: 5 },
]

// Colors for the pie chart
const LIGHT_COLORS = ["#0e4430", "#19d21f", "#5aed5f", "#8af28c", "#b5f7b6"]
const DARK_COLORS = ["#19d21f", "#0e4430", "#5aed5f", "#8af28c", "#b5f7b6"]

export function LineChart() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0e4430" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#0e4430" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke={isDark ? "#888888" : "#888888"} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke={isDark ? "#888888" : "#888888"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#f3f4f6" : "#111827",
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#0e4430"
          fillOpacity={1}
          fill="url(#colorValue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function PieChartComponent() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={breakdownData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelStyle={{ fill: isDark ? "#f3f4f6" : "#111827" }}
        >
          {breakdownData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            color: isDark ? "#f3f4f6" : "#111827",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ActivityMiniChart() {
  const [isMounted, setIsMounted] = useState(false)

  // Sample data for the mini activity chart
  const miniActivityData = [
    { name: "1", value: 20 },
    { name: "2", value: 40 },
    { name: "3", value: 30 },
    { name: "4", value: 50 },
    { name: "5", value: 35 },
    { name: "6", value: 55 },
    { name: "7", value: 40 },
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-full flex items-center justify-center">Loading...</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={miniActivityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="miniColorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#ffffff"
          fillOpacity={1}
          fill="url(#miniColorValue)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
