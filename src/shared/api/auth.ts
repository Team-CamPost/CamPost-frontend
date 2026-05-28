import {
  ApiClientError,
  apiClient,
  toApiClientError,
  unwrapResponse,
} from "./client";
import type { ApiResponse } from "../types/api";

export { ApiClientError as AuthApiError };

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

interface LoginResponse {
  userId: number;
  username: string;
  name: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
  profileCompleted?: boolean;
}

interface SignupResponse {
  name: string;
  username: string;
  email: string;
}

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/api/v1/auth/login",
      { username, password },
    );

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
};

export const checkUsernameAvailability = async (username: string) => {
  try {
    const response = await apiClient.get<
      ApiResponse<UsernameAvailabilityResponse>
    >("/api/v1/auth/check-username", {
      params: { username },
    });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
};

export const sendEmailVerificationCode = async (email: string) => {
  try {
    const response = await apiClient.post<
      ApiResponse<EmailVerificationCodeResponse>
    >("/api/v1/auth/email/verification-code", { email });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
};

export const checkEmailVerificationCode = async (
  email: string,
  code: string,
) => {
  try {
    const response = await apiClient.post<
      ApiResponse<EmailVerificationCheckResponse>
    >("/api/v1/auth/email/verification-code/check", {
      email,
      code,
    });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
};

export const signup = async ({
  name,
  username,
  email,
  password,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post<ApiResponse<SignupResponse>>(
      "/api/v1/auth/signup",
      {
        name,
        username,
        email,
        password,
      },
    );

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
};
