"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { PieChartComponent } from "../dashboard-charts";

export function PieCharts() {
  return (
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
  );
}
