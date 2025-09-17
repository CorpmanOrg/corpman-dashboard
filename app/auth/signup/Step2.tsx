import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  formik: any;
}

const Step2 = ({ onNext, onBack, formik }: Step2Props) => {
  const handleNext = async () => {
    const errors = await formik.validateForm();
    const step2Fields = ["password", "confirmPassword"];
    const step2Errors = step2Fields.filter((field) => errors[field]);
    if (step2Errors.length === 0) {
      onNext();
    } else {
      formik.setTouched({ password: true, confirmPassword: true });
    }
  };

  const isStep2Pwd = () => formik.values.confirmPassword.trim() !== "" && !formik.errors.confirmPassword;
  const isStep2CnPwd = () => formik.values.confirmPassword.trim() !== "" && !formik.errors.confirmPassword;

  return (
    <div className="form-step space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Create a password</h2>
        <p className="text-sm text-gray-500">Choose a secure password for your account</p>
      </div>

      <div className="">
        <Input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // touched={formik.touched.password}
          // error={formik.errors.password}
          placeholder="Enter your password"
        />
      </div>

      <div className="">
        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // touched={formik.touched.confirmPassword}
          // error={formik.errors.confirmPassword}
          placeholder="Enter your confirmPassword"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/2">
          Back
        </Button>
        <Button
          type="button"
          className="w-1/2 bg-green-500 hover:bg-green-600"
          onClick={handleNext}
          disabled={!isStep2Pwd() || !isStep2CnPwd()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Step2;
