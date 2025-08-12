import React from "react";
import { cn } from "@/lib/utils";

interface SignupProgressProps {
  currentStep: number;
  totalSteps: number;
}

const SignupProgress = ({ currentStep, totalSteps }: SignupProgressProps) => {
  return (
    <div className="mb-8 p-[1rem_0.5rem]">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "rounded-full h-8 w-8 flex items-center justify-center text-xs font-semibold",
                index + 1 <= currentStep ? "bg-green-500 text-white" : "bg-white text-gray-500"
              )}
            >
              {index + 1}
            </div>
            <span className={cn("text-xs mt-1", index + 1 <= currentStep ? "text-green-500" : "text-gray-500")}>
              {/* Step {index + 1} */}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 h-1 w-full bg-white rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SignupProgress;
