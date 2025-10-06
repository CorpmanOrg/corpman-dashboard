"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CardContent } from "../../components/ui/card";
import { Formik, Form } from "formik";
import { SignUpInitialValues } from "../../components/assets/data";
import { SignupSchema } from "@/utils/Yup/schema";
import Image from "next/image";

import SignupProgress from "../../components/SignupProgress";
import Step1 from "./signup/Step1";
import Step2 from "./signup/Step2";
import Step3 from "./signup/Step3";
import Step4 from "./signup/Step4";
import Signin from "./signin/SigninForm";
import EmailVerification from "./signup/EmailVerification";
import CorpManLogo from "../../components/assets/img/Corpman-logo.png";

const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode");

  const [currentStep, setCurrentStep] = useState<number>(1);

  const isSignIn = mode === "signin";

  const nextStep = () => {
    setCurrentStep((prevS) => Math.min(prevS + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prevS) => Math.max(prevS - 1, 1));
  };

  const goToSignIn = () => {
    router.push("?mode=signin");
  };

  const goToSignUp = () => {
    router.push("?mode=signup");
  };

  return (
    <div>
      <div className="bg-transparent overflow-hidden border border-none outline-none">
        <div className="flex items-center justify-center">
          <Image src={CorpManLogo} alt="Logo-Image" className="rounded-full" width="50" height="50" />
        </div>

        {isSignIn ? (
          <Signin />
        ) : (
          <>
            <CardContent className="p-6">
              {currentStep !== 5 && <SignupProgress currentStep={currentStep} totalSteps={5} />}
              <Formik
                initialValues={SignUpInitialValues}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                  console.log("Payload: ", "values");
                }}
              >
                {(formik) => (
                  <Form>
                    {currentStep === 1 && <Step1 formik={formik} onNext={nextStep} />}
                    {currentStep === 2 && <Step2 formik={formik} onNext={nextStep} onBack={prevStep} />}
                    {currentStep === 3 && <Step3 formik={formik} onNext={nextStep} onBack={prevStep} />}
                    {currentStep === 4 && <Step4 formik={formik} onNext={nextStep} onBack={prevStep} />}
                    {currentStep === 5 && <EmailVerification formik={formik} />}
                  </Form>
                )}
              </Formik>
            </CardContent>

            {currentStep <= 1 && (
              <div className="px-6 flex items-center gap-x-10">
                <p className="text-sm">
                  Already have an account?{" "}
                  <span className="text-green-500 cursor-pointer hover:underline" onClick={goToSignIn}>
                    Signin
                  </span>
                </p>
                <p className="text-sm">
                  Looking for cooperatives?{" "}
                  <span className="text-green-500 cursor-pointer hover:underline">Find here</span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignupForm;
