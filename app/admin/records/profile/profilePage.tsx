"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSingleMemberFn } from "@/utils/ApiFactory/admin";
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
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

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
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, currentOrgId } = useAuth();

  const selectedMemberId = user && user?.user?._id ? user.user._id : null;

  const { toast } = useToast();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["member-detail", currentOrgId, selectedMemberId],
    queryFn: () => getSingleMemberFn(currentOrgId!, selectedMemberId!),
    enabled: !!selectedMemberId && !!currentOrgId,
    staleTime: 60_000,
  });

  console.log("User Data in Profile Page: ", { data, isLoading, isError, error });

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information and preferences</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  {/* Profile Image */}
                  <div className="relative group mb-6">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                      {profile.profileImage ? (
                        <AvatarImage src={profile.profileImage} alt="Profile" />
                      ) : (
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {profile.firstName[0]}
                          {profile.lastName[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {editMode && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full w-10 h-10 p-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Basic Info */}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{profile.role}</p>
                  <Badge variant="outline" className="mb-4">
                    <Users className="w-3 h-3 mr-1" />
                    {profile.department}
                  </Badge>

                  {/* Quick Stats */}
                  <div className="w-full grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Joined</p>
                      <p className="font-semibold text-sm">Mar 2019</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Globe className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-sm">{profile.country}</p>
                    </div>
                  </div>

                  {/* Edit/Save Buttons */}
                  <div className="w-full space-y-2">
                    {!editMode ? (
                      <Button
                        onClick={() => setEditMode(true)}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          {isSaving ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Saving...
                            </div>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </>
                          )}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="flex-1" disabled={isSaving}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <Input
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <Input
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                    {editMode ? (
                      <Select value={profile.gender} onValueChange={handleSelectChange("gender")}>
                        <SelectTrigger className="border-blue-200 focus:border-blue-500">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input name="gender" value={profile.gender} readOnly className="bg-gray-50 dark:bg-gray-800" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                    <Input
                      name="dob"
                      type="date"
                      value={profile.dob}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">National ID</label>
                    <Input
                      name="nationalId"
                      value={profile.nationalId}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                  <Textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    readOnly={!editMode}
                    rows={4}
                    className={
                      editMode
                        ? "border-blue-200 focus:border-blue-500 resize-none"
                        : "bg-gray-50 dark:bg-gray-800 resize-none"
                    }
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-green-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                    {editMode ? (
                      <Select value={profile.country} onValueChange={handleSelectChange("country")}>
                        <SelectTrigger className="border-blue-200 focus:border-blue-500">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">🇺🇸 United States</SelectItem>
                          <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                          <SelectItem value="United Kingdom">🇬🇧 United Kingdom</SelectItem>
                          <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                          <SelectItem value="France">🇫🇷 France</SelectItem>
                          <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                          <SelectItem value="Other">🌍 Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input name="country" value={profile.country} readOnly className="bg-gray-50 dark:bg-gray-800" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">City/State</label>
                    <Input
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Postal Code</label>
                    <Input
                      name="postalCode"
                      value={profile.postalCode}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax ID</label>
                    <Input
                      name="taxId"
                      value={profile.taxId}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
