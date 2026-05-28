import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "../config/env";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "../hooks/useAuth";
import type { ApiResponse } from "../types/api";

const DEFAULT_ERROR_MESSAGE = "요청을 처리하지 못했습니다.";

const TOKEN_REFRESH_PATH = "/api/v1/auth/token/refresh";
const LOGIN_PATH = "/api/v1/auth/login";

interface ErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
}

interface TokenRefreshResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const tokenRefreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let refreshAccessTokenRequest: Promise<string> | null = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

const isTokenRefreshTarget = (url?: string) =>
  url?.includes(TOKEN_REFRESH_PATH);
const isLoginTarget = (url?: string) => url?.includes(LOGIN_PATH);

const requestNewAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new ApiClientError("로그인이 필요합니다.", "TOKEN401", 401);
  }

  const response = await tokenRefreshClient.post<
    ApiResponse<TokenRefreshResponse>
  >(TOKEN_REFRESH_PATH, { refreshToken });
  const result = unwrapResponse(response.data);

  setAccessToken(result.accessToken);

  return result.accessToken;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const status = error.response?.status;
    const shouldTryRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isLoginTarget(originalRequest.url) &&
      !isTokenRefreshTarget(originalRequest.url);

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      refreshAccessTokenRequest ??= requestNewAccessToken().finally(() => {
        refreshAccessTokenRequest = null;
      });

      const accessToken = await refreshAccessTokenRequest;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();

      return Promise.reject(refreshError);
    }
  },
);

export class ApiClientError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
  }
}

export const toApiClientError = (error: unknown) => {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const responseData = axiosError.response?.data;

    return new ApiClientError(
      responseData?.message || DEFAULT_ERROR_MESSAGE,
      responseData?.code,
      axiosError.response?.status,
    );
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError(DEFAULT_ERROR_MESSAGE);
};

export const unwrapResponse = <T>(response: ApiResponse<T>) => {
  if (!response.isSuccess) {
    throw new ApiClientError(response.message, response.code);
  }

  return response.result;
};
