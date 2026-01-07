"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMemberProfileFn, updateMemberProfileFn } from "@/utils/ApiFactory/member";
import { UpdateMemberProfileParams, UpdateMemberProfileResponse } from "@/types/types";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<UpdateMemberProfileParams>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["member-profile"],
    queryFn: getMemberProfileFn,
    staleTime: 60_000,
  });

  const profile = profileData?.user;

  // Update mutation
  const updateMutation = useMutation<UpdateMemberProfileResponse, Error, UpdateMemberProfileParams>({
    mutationFn: updateMemberProfileFn,
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["member-profile"] });
      setEditMode(false);
      setFormData({});
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "N/A";
    }
  };

  // Format join date for display
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return "N/A";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // Only send fields that have been modified
    const updates: UpdateMemberProfileParams = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof UpdateMemberProfileParams];
      if (value !== undefined && value !== null && value !== "") {
        updates[key as keyof UpdateMemberProfileParams] = value as any;
      }
    });

    // Only proceed if there are actual changes
    if (Object.keys(updates).length === 0) {
      toast({
        title: "No Changes",
        description: "No fields were modified.",
        variant: "default",
      });
      setEditMode(false);
      return;
    }

    updateMutation.mutate(updates);
  };

  const handleCancel = () => {
    setProfileImage(null);
    setFormData({});
    setEditMode(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-full">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-5 w-96 bg-gray-300 dark:bg-gray-700" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 bg-gray-300 dark:bg-gray-700" />
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-64 bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-48 bg-gray-300 dark:bg-gray-700" />
              <Skeleton className="h-64 bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !profile) {
    return (
      <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-full">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Profile</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {(error as any)?.message || "Unable to fetch your profile data."}
                </p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Extract org info
  const orgInfo = profile.organizations?.[0];
  const userRole = orgInfo?.role || "member";
  const orgStatus = orgInfo?.status || "N/A";

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
              {orgStatus === "active" ? "Verified" : orgStatus}
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
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt="Profile" />
                      ) : (
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          {profile.firstName?.[0] || ""}
                          {profile.surname?.[0] || ""}
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
                    {profile.firstName} {profile.surname}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{userRole}</p>
                  <Badge variant="outline" className="mb-4">
                    <Users className="w-3 h-3 mr-1" />
                    {profile.employer || "N/A"}
                  </Badge>

                  {/* Quick Stats */}
                  <div className="w-full grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Joined</p>
                      <p className="font-semibold text-sm">{formatJoinDate(profile.createdAt)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Globe className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-sm">{profile.stateOfOrigin || "N/A"}</p>
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
                          disabled={updateMutation.isPending}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          {updateMutation.isPending ? (
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
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="flex-1"
                          disabled={updateMutation.isPending}
                        >
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
                      value={formData.firstName !== undefined ? formData.firstName : profile.firstName || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <Input
                      name="surname"
                      value={formData.surname !== undefined ? formData.surname : profile.surname || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Middle Name</label>
                    <Input
                      name="middleName"
                      value={formData.middleName !== undefined ? formData.middleName : profile.middleName || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marital Status</label>
                    {editMode ? (
                      <Select
                        value={
                          formData.maritalStatus !== undefined ? formData.maritalStatus : profile.maritalStatus || ""
                        }
                        onValueChange={handleSelectChange("maritalStatus")}
                      >
                        <SelectTrigger className="border-blue-200 focus:border-blue-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        name="maritalStatus"
                        value={profile.maritalStatus || "N/A"}
                        readOnly
                        className="bg-gray-50 dark:bg-gray-800"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</label>
                    <Input
                      name="dateOfBirth"
                      type="date"
                      value={
                        formData.dateOfBirth !== undefined ? formData.dateOfBirth : formatDate(profile.dateOfBirth)
                      }
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Member ID</label>
                    <Input name="memberId" value={profile._id || ""} readOnly className="bg-gray-50 dark:bg-gray-800" />
                  </div>
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
                      value={formData.email !== undefined ? formData.email : profile.email || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                    <Input
                      name="mobileNumber"
                      type="tel"
                      value={formData.mobileNumber !== undefined ? formData.mobileNumber : profile.mobileNumber || ""}
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
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">State of Origin</label>
                    <Input
                      name="stateOfOrigin"
                      value={
                        formData.stateOfOrigin !== undefined ? formData.stateOfOrigin : profile.stateOfOrigin || ""
                      }
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LGA</label>
                    <Input
                      name="LGA"
                      value={formData.LGA !== undefined ? formData.LGA : profile.LGA || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Residential Address</label>
                    <Input
                      name="residentialAddress"
                      value={
                        formData.residentialAddress !== undefined
                          ? formData.residentialAddress
                          : profile.residentialAddress || ""
                      }
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                    <Input
                      name="address"
                      value={formData.address !== undefined ? formData.address : profile.address || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial & Next of Kin Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-500" />
                  Financial & Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Employer</label>
                    <Input
                      name="employer"
                      value={formData.employer !== undefined ? formData.employer : profile.employer || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Income</label>
                    <Input
                      name="annualIncome"
                      type="number"
                      value={formData.annualIncome !== undefined ? formData.annualIncome : profile.annualIncome || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Contribution</label>
                    <Input
                      name="monthlyContribution"
                      type="number"
                      value={
                        formData.monthlyContribution !== undefined
                          ? formData.monthlyContribution
                          : profile.monthlyContribution || ""
                      }
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Next of Kin</label>
                    <Input
                      name="nextOfKin"
                      value={formData.nextOfKin !== undefined ? formData.nextOfKin : profile.nextOfKin || ""}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</label>
                    <Input
                      name="nextOfKinRelationship"
                      value={
                        formData.nextOfKinRelationship !== undefined
                          ? formData.nextOfKinRelationship
                          : profile.nextOfKinRelationship || ""
                      }
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={editMode ? "border-blue-200 focus:border-blue-500" : "bg-gray-50 dark:bg-gray-800"}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Next of Kin Address</label>
                    <Input
                      name="nextOfKinAddress"
                      value={
                        formData.nextOfKinAddress !== undefined
                          ? formData.nextOfKinAddress
                          : profile.nextOfKinAddress || ""
                      }
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
