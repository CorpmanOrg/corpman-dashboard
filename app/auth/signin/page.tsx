"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import { LoginInitialValues } from "../../../components/assets/data";
import { LoginSchema } from "@/utils/Yup/schema";
import { loginFn } from "@/utils/ApiFactory/auth";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { StorageUtil } from "@/utils/StorageUtil";

interface BackProps {
  flipBack: (val: boolean) => void;
}

const Signin = ({ flipBack }: BackProps) => {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      console.log("From Login Success: ", data);
      StorageUtil.setSessionItem("logData", data);
      refetchUser();
      router.push("/");
    },
    onError: (error: AxiosError) => {
      // console.log("From Login Error: ", error);
    },
  });

  const handleBack = () => {
    flipBack(false);
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Sign In</h1>
        <p className="text-sm text-gray-500 mb-2">Login with your correct credentials</p>

        <Formik
          initialValues={LoginInitialValues}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            loginUser(values);
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit}>
              <div className="space-y-2">
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.email}
                  error={formik.errors.email}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mt-[10px]">
                <Input
                  name="password"
                  label="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  touched={formik.touched.password}
                  error={formik.errors.password}
                  placeholder="Enter your password"
                />
              </div>

              <div className="mt-[25px]">
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={!formik.values.email || !formik.values.password}
                >
                  {isPending ? "Validating..." : "Signin"}
                </Button>
                <p
                  className="text-gray-500 font-thin text-sm mt-2 cursor-pointer hover:text-green-500 hover:underline"
                  onClick={handleBack}
                >
                  back
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Signin;
