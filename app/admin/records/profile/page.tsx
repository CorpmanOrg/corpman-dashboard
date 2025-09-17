"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const initialProfile = {
  firstName: "Leslie",
  lastName: "Alexander",
  email: "leslie.alexander@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Customer-focused manager with 10+ years of experience.",
  gender: "Female",
  dob: "1985-06-15",
  nationalId: "A123456789",
  country: "United States",
  city: "New York, NY",
  postalCode: "10001",
  taxId: "TAX-987654321",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setProfile((prev) => ({ ...prev, gender: value }));
  };

  const handleCountryChange = (value: string) => {
    setProfile((prev) => ({ ...prev, country: value }));
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start bg-muted/40 py-6 px-1">
      <div
        className="w-full max-w-7xl bg-white shadow-lg rounded-2xl flex flex-col md:flex-row overflow-hidden"
        style={{ minHeight: "70vh" }}
      >
        {/* Sidebar */}
        <aside className="md:w-64 w-full bg-gradient-to-b from-gray-100 to-white flex flex-col items-center p-6 border-b md:border-b-0 md:border-r">
          <Avatar className="h-24 w-24 mb-3">
            <AvatarFallback>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-20 h-20 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.125a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21c-2.676 0-5.216-.584-7.499-1.875z"
                />
              </svg>
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="text-muted-foreground mb-4">Customer Service Manager</p>
          <Button onClick={() => setEditMode((v) => !v)} className="w-full mt-2" variant="default">
            {editMode ? "Save" : "Edit"}
          </Button>
          <div className="mt-8 w-full">
            <Input name="email" label="Email" value={profile.email} onChange={handleChange} readOnly={!editMode} />
            <Input
              name="phone"
              label="Phone"
              value={profile.phone}
              onChange={handleChange}
              readOnly={!editMode}
              className="mt-4"
            />
            <div className="mt-4">
              <label htmlFor="bio" className="text-sm block font-medium mb-1">
                Bio
              </label>
              <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} readOnly={!editMode} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Personal Details Section */}
          <section className="mb-10">
            <h3 className="font-bold text-lg mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                readOnly={!editMode}
              />
              <Input
                label="Last Name"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                readOnly={!editMode}
              />
              <div>
                <label className="text-sm block font-medium mb-1">Gender</label>
                {editMode ? (
                  <Select value={profile.gender} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input name="gender" value={profile.gender} readOnly />
                )}
              </div>
              <Input
                label="Date of Birth"
                name="dob"
                value={profile.dob}
                onChange={handleChange}
                readOnly={!editMode}
                type="date"
              />
              <Input
                label="National ID"
                name="nationalId"
                value={profile.nationalId}
                onChange={handleChange}
                readOnly={!editMode}
              />
            </div>
          </section>

          {/* Address Section */}
          <section>
            <h3 className="font-bold text-lg mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm block font-medium mb-1">Country</label>
                {editMode ? (
                  <Select value={profile.country} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input name="country" value={profile.country} readOnly />
                )}
              </div>
              <Input label="City/State" name="city" value={profile.city} onChange={handleChange} readOnly={!editMode} />
              <Input
                label="Postal Code"
                name="postalCode"
                value={profile.postalCode}
                onChange={handleChange}
                readOnly={!editMode}
              />
              <Input label="Tax ID" name="taxId" value={profile.taxId} onChange={handleChange} readOnly={!editMode} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
