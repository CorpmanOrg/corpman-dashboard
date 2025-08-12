import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { SESSION_IDENTIFIER } from "@/constants";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_TEST_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000
});

//Request Interceptor
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("__tk");
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

//Response Interceptor
Axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<any> => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("__tk");
      window.location.assign("/login")
    }
    // return Promise.reject(error.response ?? error);
    return Promise.reject(error);
  }
);

export default Axios;
