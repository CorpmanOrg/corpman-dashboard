"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import UserProfile from "./profilePage";
import CooperativeProfile from "./cooperativepage";

export default function ProfilePage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { toast } = useToast();

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Show cards only when nothing is selected */}
        {selectedRole === null ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              onClick={() => {
                setSelectedRole("Cooperative");
                toast({ title: "Cooperative selected", description: "Viewing cooperative profile." });
              }}
              className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedRole === "Cooperative" ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-500" />
                  Cooperative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRole("Cooperative");
                    toast({ title: "Cooperative selected", description: "Viewing cooperative profile." });
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card
              onClick={() => {
                setSelectedRole("User");
                toast({ title: "User selected", description: "Viewing user profile." });
              }}
              className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedRole === "User" ? "ring-2 ring-blue-400" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="w-6 h-6 text-green-500" />
                  User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRole("User");
                    toast({ title: "User selected", description: "Viewing user profile." });
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Details view for the selected role with Back button
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" onClick={() => setSelectedRole(null)}>
                ← Back
              </Button>
              <h2 className="text-2xl font-semibold">{selectedRole} Details</h2>
            </div>

            {selectedRole === "User" && (
              <div className="mt-2">
                <UserProfile />
              </div>
            )}

            {selectedRole === "Cooperative" && (
              <div className="mt-2">
                <CooperativeProfile />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
