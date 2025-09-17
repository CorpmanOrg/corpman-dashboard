"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

// Dummy data for recent activities
const recentActivities = [
  { id: 1, action: "Deposited ₦10,000", date: "2025-09-10" },
  { id: 2, action: "Withdrew ₦2,000", date: "2025-09-12" },
  { id: 3, action: "Deposited ₦5,000", date: "2025-09-13" },
  { id: 4, action: "Changed password", date: "2025-09-14" },
];

const RecentActivities: React.FC = () => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600 h-full w-full flex flex-col min-h-[410px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
        <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">Recent Activities</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="space-y-4 h-full max-h-72 overflow-y-auto pr-2">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                <Users className="h-5 w-5 text-[#19d21f] dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium dark:text-gray-200">{activity.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
