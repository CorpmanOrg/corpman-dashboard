import * as Yup from "yup";

export const SignupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  address: Yup.string().required("usAddress is required"),
  email: Yup.string()
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Please enter a valid email address"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
    terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"), 
});

export const LoginSchema = Yup.object({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});
