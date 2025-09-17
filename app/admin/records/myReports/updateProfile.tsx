"use client";
import React from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";

// Dummy Label component (replace with your actual Label import if available)
const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

const initialValues = {
  surname: "",
  firstName: "",
  middleName: "",
  email: "",
  password: "",
  address: "",
  dateOfBirth: "",
  stateOfOrigin: "",
  LGA: "",
  mobileNumber: "",
  employer: "",
  residentialAddress: "",
  monthlyContribution: "",
  maritalStatus: "",
  annualIncome: "",
  nextOfKin: "",
  nextOfKinRelationship: "",
  nextOfKinAddress: "",
};

const UpdateProfile = () => {
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      alert("Profile updated!\n" + JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] 2xl:h-[900px] overflow-auto p-4">
      <form className="space-y-8 h-full" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1">
          <div>
            <Label htmlFor="Surname">Surname</Label>
            <Input
              name="surname"
              type="text"
              value={formik.values.surname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Firstname">Firstname</Label>
            <Input
              name="firstName"
              type="text"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Middlename">Middlename</Label>
            <Input
              name="middleName"
              type="text"
              value={formik.values.middleName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Email">Email</Label>
            <Input
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Password">Password</Label>
            <Input
              name="password"
              type="text"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="address">Residential Address</Label>
            <Input
              name="address"
              type="text"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="DateOfBirth">Date of Birth</Label>
            <Input
              name="dateOfBirth"
              type="date"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="StateOfOrigin">State Of Origin</Label>
            <Input
              name="stateOfOrigin"
              type="text"
              value={formik.values.stateOfOrigin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="lga">LGA</Label>
            <Input
              name="LGA"
              type="text"
              value={formik.values.LGA}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              name="mobileNumber"
              type="text"
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="employer">Employer</Label>
            <Input
              name="employer"
              type="text"
              value={formik.values.employer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Employer Address">Employer Address</Label>
            <Input
              name="residentialAddress"
              type="text"
              value={formik.values.residentialAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Contribution">Monthly Contribution</Label>
            <Input
              name="monthlyContribution"
              type="number"
              value={formik.values.monthlyContribution}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="MaritalStatus">Marital Status</Label>
            <Input
              name="maritalStatus"
              type="text"
              value={formik.values.maritalStatus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="AnualIncome">Anual Income</Label>
            <Input
              name="annualIncome"
              type="number"
              value={formik.values.annualIncome}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Nextofkin">Next of Kin</Label>
            <Input
              name="nextOfKin"
              type="text"
              value={formik.values.nextOfKin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="Nextofkin">Relatioship with Next of Kin</Label>
            <Input
              name="nextOfKinRelationship"
              type="text"
              value={formik.values.nextOfKinRelationship}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="NextofkinPhone">Next of Kin Address</Label>
            <Input
              name="nextOfKinAddress"
              type="text"
              value={formik.values.nextOfKinAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
