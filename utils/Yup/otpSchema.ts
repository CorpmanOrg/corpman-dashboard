import * as Yup from "yup";

export const getOtpSchema = (length = 6) =>
  Yup.string()
    .required("Enter the verification code.")
    .matches(new RegExp(`^\\d{${length}}$`), `Code must be exactly ${length} digits.`);

export const otpFormSchema = (length = 6) =>
  Yup.object({
    otp: getOtpSchema(length),
  });
