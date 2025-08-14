import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step1Props {
  onNext: () => void;
  formik: any;
}

const Step1 = ({ onNext, formik }: Step1Props) => {
  
  const handleNext = async () => {
    const errors = await formik.validateForm();
    const step1Fields = ["email"];
    const step1Errors = step1Fields.filter((field) => errors[field]);
    if (step1Errors.length === 0) {
      onNext();
    } else {
      formik.setTouched({ email: true });
    }
  };

  const isStep1Ready = () => formik.values.email.trim() !== "" && !formik.errors.email;

  console.log("Check: ", { isValid: formik.isValid, isDirty: formik.dirty, formik });

  return (
    <div className="from-step space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Create your account</h2>
        <p className="text-sm text-gray-500">Enter your email to get started</p>
      </div>

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

      <Button
        type="button"
        className="w-full disabled:cursor-not-allowed"
        onClick={handleNext}
        disabled={!isStep1Ready()}
      >
        Next
      </Button>
    </div>
  );
};

export default Step1;
