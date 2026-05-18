import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import { getAccessToken } from "../hooks/useAuth";
import type { ApiResponse } from "../types/api";

const userApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface ErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
}

export interface OnboardingProfileResponse {
  userId: number;
  department: string;
  grade: number;
  nickname: string;
  profileCompleted: boolean;
}

export class UserApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "UserApiError";
    this.code = code;
    this.status = status;
  }
}

const toUserApiError = (error: unknown) => {
  if (error instanceof UserApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const responseData = axiosError.response?.data;

    return new UserApiError(
      responseData?.message || "요청을 처리하지 못했습니다.",
      responseData?.code,
      axiosError.response?.status,
    );
  }

  if (error instanceof Error) {
    return new UserApiError(error.message);
  }

  return new UserApiError("요청을 처리하지 못했습니다.");
};

const unwrapResponse = <T>(response: ApiResponse<T>) => {
  if (!response.isSuccess) {
    throw new UserApiError(response.message, response.code);
  }

  return response.result;
};

export const saveOnboardingProfile = async ({
  department,
  grade,
  nickname,
}: {
  department: string;
  grade: number;
  nickname: string;
}) => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new UserApiError("로그인이 필요합니다.", "TOKEN402", 401);
  }

  try {
    const response = await userApiClient.patch<
      ApiResponse<OnboardingProfileResponse>
    >(
      "/api/v1/users/me/onboarding-profile",
      { department, grade, nickname },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return unwrapResponse(response.data);
  } catch (error) {
    throw toUserApiError(error);
  }
};
