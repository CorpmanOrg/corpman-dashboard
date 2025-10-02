"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AreaProps, TooltipProps, XAxisProps, YAxisProps, PieProps, BarProps } from "recharts";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useTheme } from "@/components/theme-provider";

// Dynamically import recharts components (client-side only)
// const ResponsiveContainer = dynamic(() => import("recharts").then((m) => ({ default: m.ResponsiveContainer })), {
//   ssr: false,
// });
// const AreaChart = dynamic(() => import("recharts").then((m) => ({ default: m.AreaChart })), { ssr: false });
// const Area = dynamic(() => import("recharts").then((m) => ({ default: m.Area })), { ssr: false });
// const Tooltip = dynamic(() => import("recharts").then((m) => ({ default: m.Tooltip })), { ssr: false });
// const XAxis = dynamic(() => import("recharts").then((m) => ({ default: m.XAxis })), { ssr: false });
// const YAxis = dynamic(() => import("recharts").then((m) => ({ default: m.YAxis })), { ssr: false });
// const PieChart = dynamic(() => import("recharts").then((m) => ({ default: m.PieChart })), { ssr: false });
// const Pie = dynamic(() => import("recharts").then((m) => ({ default: m.Pie })), { ssr: false });
// const Bar = dynamic(() => import("recharts").then((m) => ({ default: m.Bar })), { ssr: false });
// const Cell = dynamic(() => import("recharts").then((m) => ({ default: m.Cell })), { ssr: false });
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
];

// Sample data for the pie chart
const breakdownData = [
  { name: "Category A", value: 35 },
  { name: "Category B", value: 25 },
  { name: "Category C", value: 20 },
  { name: "Category D", value: 15 },
  { name: "Category E", value: 5 },
];

const PIE_DATA = [
  { name: "Rejected", value: "08/28/2025" },
  { name: "Total Joined", value: 15 },
  { name: "Active", value: 2 },
  { name: "Pending", value: 4 },
];

// Colors for the pie chart
const LIGHT_COLORS = ["#0e4430", "#19d21f", "#5aed5f", "#8af28c", "#b5f7b6"];
const DARK_COLORS = ["#19d21f", "#0e4430", "#5aed5f", "#8af28c", "#b5f7b6"];

type BarDataType = { name: string; value: number };

const BAR_DATA: BarDataType[] = [
  { name: "Total Joined", value: 15 },
  { name: "Active", value: 2 },
  { name: "Pending", value: 4 },
];

const COLORS = ["#22c55e", "#065f46", "#4ade80"];

export function LineChart({ data }: { data?: { name: string; value: number }[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>;
  }

  const chartData = data ?? activityData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
  );
}

export function PieChartComponent({ data }: { data?: { name: string; value: number }[] }) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const COLORS = isDark ? DARK_COLORS : LIGHT_COLORS;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading chart...</div>;
  }

  const chartData = data ?? breakdownData;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent, x, y }) => (
            <text
              x={x}
              y={y}
              fill={isDark ? "#f3f4f6" : "#111827"}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
            >
              {`${name} ${(percent * 100).toFixed(0)}%`}
            </text>
          )}
        >
          {chartData.map((entry, index) => (
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
  );
}

export function ActivityMiniChart() {
  const [isMounted, setIsMounted] = useState(false);

  const miniActivityData = [
    { name: "1", value: 20 },
    { name: "2", value: 40 },
    { name: "3", value: 30 },
    { name: "4", value: 50 },
    { name: "5", value: 35 },
    { name: "6", value: 55 },
    { name: "7", value: 40 },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
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
  );
}

export function ActivityPieMiniChart() {
  const pieData = [
    { name: "Active", value: 30 },
    { name: "Pending", value: 30 },
    { name: "Rejected", value: 40 },
  ];

  const COLORS = ["#bdecceff", "#f8e8a8ff", "#fcb6b6ff"];
  const total = pieData.reduce((acc, cur) => acc + cur.value, 0);
  const percent = Math.round((pieData[1].value / total) * 100);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            startAngle={180}
            endAngle={0}
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            cx="50%"
            cy="100%"
            stroke="none"
            isAnimationActive={false}
            label={false}
          >
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <text
            x="50%"
            y="80%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={14}
            fontWeight={700}
            fill={isDark ? "#fff" : "#111827"}
          >
            {percent}%
          </text>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-4 mt-1 w-full">
        {pieData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-xs font-medium text-gray-900 dark:text-white">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActivityBarMiniChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  const total = BAR_DATA.reduce((acc: number, cur: BarDataType) => acc + cur.value, 0);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={BAR_DATA} barCategoryGap="40%" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
          <YAxis hide />
          <Bar dataKey="value" radius={[8, 8, 8, 8]}>
            {BAR_DATA.map((entry: BarDataType, idx: number) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold text-white drop-shadow">{total}</span>
        <span className="text-xs mt-1 px-2 py-0.5 rounded bg-green-100/60 text-green-900 font-semibold shadow">
          +4.25%
        </span>
      </div>
    </div>
  );
}
