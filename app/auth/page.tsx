"use client";

import { Suspense } from "react";
import Image from "next/image";
import BkgImage from "../../components/assets/img/auth-bkdImg.png";
import SignupForm from "@/app/auth/SignupForm";
import Signin from "./signin/SigninForm";

const SignUp = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Image src={BkgImage} alt="Background" fill className="object-cover -z-10" priority />

      <div className="absolute inset-0 backdrop-blur-[3px] bg-white/30 -z-0" />

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="min-w-[400px] bg-white/40 backdrop-blur-md border border-white/50 shadow-lg rounded-lg px-6 py-6">
          {/* <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SignupForm />
          </Suspense> */}
          <h1 className="text-center text-2xl font-bold mb-[4rem]">CorpMan Portal</h1>

          <Signin />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
