"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Camera,
  Edit3,
  Save,
  X,
  Check,
  Globe,
  Users,
  Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserProfile from "./profilePage";
import CooperativeProfile from "./cooperativepage";

const initialProfile = {
  firstName: "Leslie",
  lastName: "Alexander",
  email: "leslie.alexander@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Customer-focused manager with 10+ years of experience in building scalable solutions and leading cross-functional teams.",
  gender: "Female",
  dob: "1985-06-15",
  nationalId: "A123456789",
  country: "United States",
  city: "New York, NY",
  postalCode: "10001",
  taxId: "TAX-987654321",
  role: "Senior Customer Service Manager",
  department: "Customer Success",
  joinDate: "2019-03-15",
  profileImage: null as string | null,
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setEditMode(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setEditMode(false);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Show cards only when nothing is selected */}
        {selectedRole === null ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card
              onClick={() => {
                setSelectedRole("Cooperative");
                toast({ title: "Cooperative selected", description: "Proceed to configure cooperative settings." });
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
                  onClick={() => {
                    setSelectedRole("Cooperative");
                    toast({ title: "Cooperative selected", description: "Proceed to configure cooperative settings." });
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>

            <Card
              onClick={() => {
                setSelectedRole("User");
                toast({ title: "User selected", description: "Proceed to configure individual user profile." });
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
                  onClick={() => {
                    setSelectedRole("User");
                    toast({ title: "User selected", description: "Proceed to configure individual user profile." });
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
