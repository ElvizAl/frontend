// service/auth-service.ts
import { apiClient } from "@/lib/api-client";
import { RegisterInput, LoginInput, VerifyEmailOtpInput, ResendVerificationOtpInput, LoginResponse } from "@/validasi/auth-validasi";

export const registerUser = (data: RegisterInput) =>
  apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const loginUser = (data: LoginInput) =>
  apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const verifyEmailUser = (data: VerifyEmailOtpInput) =>
  apiClient("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const resendVerificationOtp = (data: ResendVerificationOtpInput) =>
  apiClient("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
