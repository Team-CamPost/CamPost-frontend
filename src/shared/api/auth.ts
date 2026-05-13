import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import type { ApiResponse } from "../types/api";

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface ErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
}

interface UsernameAvailabilityResponse {
  username: string;
  available: boolean;
}

interface EmailVerificationCodeResponse {
  email: string;
  expiresAt: string;
}

interface EmailVerificationCheckResponse {
  email: string;
  verified: boolean;
  verifiedAt: string;
}

interface SignupResponse {
  username: string;
  email: string;
}

export class AuthApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.status = status;
  }
}

const toAuthApiError = (error: unknown) => {
  if (error instanceof AuthApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const responseData = axiosError.response?.data;

    return new AuthApiError(
      responseData?.message || "요청을 처리하지 못했습니다.",
      responseData?.code,
      axiosError.response?.status,
    );
  }

  if (error instanceof Error) {
    return new AuthApiError(error.message);
  }

  return new AuthApiError("요청을 처리하지 못했습니다.");
};

const unwrapResponse = <T>(response: ApiResponse<T>) => {
  if (!response.isSuccess) {
    throw new AuthApiError(response.message, response.code);
  }

  return response.result;
};

export const checkUsernameAvailability = async (username: string) => {
  try {
    const response = await authApiClient.get<
      ApiResponse<UsernameAvailabilityResponse>
    >("/api/v1/auth/check-username", {
      params: { username },
    });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toAuthApiError(error);
  }
};

export const sendEmailVerificationCode = async (email: string) => {
  try {
    const response = await authApiClient.post<
      ApiResponse<EmailVerificationCodeResponse>
    >("/api/v1/auth/email/verification-code", { email });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toAuthApiError(error);
  }
};

export const checkEmailVerificationCode = async (
  email: string,
  code: string,
) => {
  try {
    const response = await authApiClient.post<
      ApiResponse<EmailVerificationCheckResponse>
    >("/api/v1/auth/email/verification-code/check", {
      email,
      code,
    });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toAuthApiError(error);
  }
};

export const signup = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await authApiClient.post<ApiResponse<SignupResponse>>(
      "/api/v1/auth/signup",
      {
        username,
        email,
        password,
      },
    );

    return unwrapResponse(response.data);
  } catch (error) {
    throw toAuthApiError(error);
  }
};
