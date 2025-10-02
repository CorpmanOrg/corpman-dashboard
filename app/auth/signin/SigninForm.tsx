"use client";
import React, { useState } from "react";
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
import Toastbar from "@/components/Toastbar";
import { ToastSeverity, ToastState } from "@/types/types";

interface BackProps {
  flipBack: (val: boolean) => void;
}

const Signin = () => {
  const router = useRouter();
  const { refetchUser } = useAuth();

  const [toast, setToast] = useState<ToastState>({
    open: false,
    severity: "success",
    message: "",
  });

  const showToast = (severity: ToastSeverity, message: string) => {
    setToast({
      open: true,
      severity,
      message,
    });
  };

  const handleCloseToast = () => {
    setToast((prevS) => ({
      ...prevS,
      open: false,
    }));
  };

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      StorageUtil.setSessionItem("logData", data);
      refetchUser();
      router.push("/");
    },
    onError: (error: any) => {
      console.error("From Login Error: ", error);

      // Try to extract backend message
      const backendMessage =
        error?.response?.data?.message || // axios-like response
        error?.message || // generic error
        null;

      if (backendMessage) {
        showToast("error", backendMessage);
      } else {
        // fallback for network / unknown errors
        showToast("error", "Unable to connect. Please try again later.");
      }
    },
  });

  // const handleBack = () => {
  //   flipBack(false);
  // };

  return (
    <>
      <Toastbar open={toast.open} message={toast.message} severity={toast.severity} onClose={handleCloseToast} />
      <div className="px-6">
        <h1 className="text-lg text-center text-gray-800 mb-1 font-bold">Sign In</h1>
        <p className="text-[#8D8D8D] text-sm text-center mb-10">Sign in with your correct credentials</p>

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
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // touched={formik.touched.email}
                  // error={formik.errors.email}
                  placeholder="Email"
                />
              </div>

              <div className="mt-[10px]">
                <Input
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // touched={formik.touched.password}
                  // error={formik.errors.password}
                  placeholder="Password"
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
                {/* <p
                  className="text-gray-500 font-thin text-sm mt-2 cursor-pointer hover:text-green-500 hover:underline"
                  onClick={handleBack}
                >
                  back
                </p> */}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Signin;
