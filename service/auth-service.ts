// service/auth-service.ts
import { apiClient } from "@/lib/api-client";
import { RegisterInput, LoginInput, VerifyEmailOtpInput, ResendVerificationOtpInput, LoginResponse, ForgotPasswordInput, ResetPasswordInput } from "@/validasi/auth-validasi";

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

export const forgotPassword = (data: ForgotPasswordInput) =>
  apiClient("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const resetPassword = (data: ResetPasswordInput) =>
  apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
