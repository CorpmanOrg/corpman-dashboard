import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
  formik: any;
}

const Step3 = ({ onNext, onBack, formik }: Step3Props) => {
  const handleNext = async () => {
    const errors = await formik.validateForm();
    const step3Fields = ["name", "address"];
    const step3Errors = step3Fields.filter((field) => errors[field]);
    if (step3Errors.length === 0) {
      onNext();
    } else {
      formik.setTouched({ name: true, address: true });
    }
  };

  const isStep3Name = () => formik.values.name.trim() !== "" && !formik.errors.name;
  const isStep3Address = () => formik.values.address.trim() !== "" && !formik.errors.address;

  return (
    <div className="form-step space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Your Information</h2>
        <p className="text-sm text-gray-500">Tell us a bit about yourself</p>
      </div>

      <div className="space-y-2">
        <Input
          name="name"
          label="Company Name"
          type="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // touched={formik.touched.name}
          // error={formik.errors.name}
          placeholder="Enter your company name"
        />
      </div>

      <div className="space-y-2">
        <Input
          name="address"
          label="Company Address"
          type="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          // touched={formik.touched.address}
          // error={formik.errors.address}
          placeholder="Enter your company address"
        />
      </div>

      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-1/2">
          Back
        </Button>
        <Button
          type="button"
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={handleNext}
          disabled={!isStep3Name() || !isStep3Address()}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default Step3;
