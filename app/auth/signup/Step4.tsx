'use-client'
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupFn } from "@/utils/ApiFactory/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";

interface Step4Props {
  onNext: () => void;
  onBack: () => void;
  formik: any;
}

const Step4 = ({ onBack, onNext, formik }: Step4Props) => {
  const { toast } = useToast();

   useEffect(() => {
    console.log("toast should display now")
    toast({
      title: "Toast Test",
      description: "This is a test toast",
      variant: "default",
    });
  }, []);

  const { mutate: signupUser, isPending } = useMutation({
    mutationFn: signupFn,
    onSuccess: () => {
      toast({
        title: "Signup Successful",
        description: "Please check your email to verify your account",
        duration: 6000,
      });
      // formik.resetForm();
      onNext()
    },
    onError: (error: AxiosError) => {
      console.log("From Signup: ", (error.response?.data as any)?.errors)
      toast({
        title: "Signup Failed",
        description: ((error.response?.data as any)?.errors || []).join(", ") || "An error occurred during signup.",
        variant: "destructive",
        duration: 6000,
      });
    },
  });

  const handleSubmit = async () => {
    const errors = await formik.validateForm();
    const step4Fields = ["terms"];
    const step4Errors = step4Fields.filter((field) => errors[field]);
    if (step4Errors.length === 0) {
      const {terms, ...payload} =  formik.values;
      signupUser(payload)
    } else {
      formik.setTouched({ terms: true });
    }
  };

  const isStep4Ready = () => formik.values.terms !== false;

  console.log("Step 4: ", { formik });

  return (
    <div className="form-step space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Almost there!</h2>
        <p className="text-sm text-gray-500">Review your information</p>
      </div>

      <div className="space-y-2 bg-gray-50 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Email:</span>
          <span>{formik.values.email}</span>
          <span className="text-gray-500">Name:</span>
          <span>{formik.values.name}</span>
          <span className="text-gray-500">Address:</span>
          <span>{formik.values.address}</span>
        </div>
      </div>

      <div className="flex items-start space-x-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={formik.values.terms}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className=""
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the terms and conditions
          </Label>
          <p className="text-xs text-muted-foreground">
            By checking this box, you agree to our{" "}
            <a href="#" className="text-green-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/2">
          Back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isStep4Ready() || isPending}
          className="w-1/2 bg-green-500 hover:bg-green-600"
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default Step4;
