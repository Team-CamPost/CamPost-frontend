import { getAccessToken } from "../hooks/useAuth";
import type { ApiResponse } from "../types/api";
import {
  ApiClientError,
  apiClient,
  toApiClientError,
  unwrapResponse,
} from "./client";

export { ApiClientError as UserApiError };

export interface OnboardingProfileResponse {
  userId: number;
  department: string;
  grade: number;
  nickname: string;
  profileCompleted: boolean;
}

export interface UserProfileResponse {
  userId: number;
  username: string;
  email: string;
  nickname: string;
  department: string | null;
  grade: number | null;
  role: string;
  profileCompleted: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export const getMyProfile = async () => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new ApiClientError("로그인이 필요합니다.", "TOKEN402", 401);
  }

  try {
    const response =
      await apiClient.get<ApiResponse<UserProfileResponse>>("/api/v1/users/me");

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
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
    throw new ApiClientError("로그인이 필요합니다.", "TOKEN402", 401);
  }

  try {
    const response = await apiClient.patch<
      ApiResponse<OnboardingProfileResponse>
    >("/api/v1/users/me/onboarding-profile", { department, grade, nickname });

    return unwrapResponse(response.data);
  } catch (error) {
    throw toApiClientError(error);
  }
};
