import React from "react";
import Image from "next/image"
import BkgImage from "../../components/assets/img/auth-bkdImg.png"
import SignupForm from "@/components/SignupForm";

const SignUp = () => {
  return (
    <div className="relative min-h-screen w-full">
    <Image src={BkgImage} alt="Background" fill className="object-cover -z-10" />

    <div className="absolute inset-0 backdrop-blur-[3px] bg-white/30 -z-0" />
    <div className="relative z-10 flex items-center justify-center min-h-screen">
      <div className="w-[700px] bg-white/40 backdrop-blur-md border border-white/50 shadow-lg rounded-lg px-6 py-10">
        <SignupForm />
      </div>
    </div>
  </div>
  )
};

export default SignUp;
