"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Users } from "lucide-react";

export function RecentActivities() {
  return (
    <>
      <Card className="shadow-md hover:shadow-lg transition-shadow border-t-4 border-t-[#19d21f] dark:shadow-green-900/10 dark:bg-gray-900 dark:border-t-green-600">
        <CardHeader className="flex-flex-row items-center justify-between pb-2 bg-[#f9fdf9] dark:bg-gray-900/50">
          <CardTitle className="text-lg font-medium text-[#0e4430] dark:text-green-400">Recent Activities</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((item, idx) => (
              <div
                key={idx}
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
    </>
  );
}
