import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import { getAccessToken } from "../hooks/useAuth";
import type { ApiResponse } from "../types/api";

const DEFAULT_ERROR_MESSAGE = "요청을 처리하지 못했습니다.";

interface ErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

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
