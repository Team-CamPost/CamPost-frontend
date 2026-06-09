import { apiClient, unwrapResponse } from "./client";
import type { ApiResponse } from "../types/api";
import type { NoticeDto } from "../../features/dashboard/types/notice";

export interface BookmarkStatus {
  noticeId: number;
  bookmarked: boolean;
}

export const fetchBookmarkedNotices = async (
  limit = 50,
): Promise<NoticeDto[]> => {
  const response = await apiClient.get<ApiResponse<NoticeDto[]>>(
    "/api/v1/notices/bookmarked",
    { params: { limit } },
  );
  return unwrapResponse(response.data);
};

export const addBookmark = async (
  noticeId: number,
): Promise<BookmarkStatus> => {
  const response = await apiClient.post<ApiResponse<BookmarkStatus>>(
    `/api/v1/notices/${noticeId}/bookmark`,
  );
  return unwrapResponse(response.data);
};

export const removeBookmark = async (
  noticeId: number,
): Promise<BookmarkStatus> => {
  const response = await apiClient.delete<ApiResponse<BookmarkStatus>>(
    `/api/v1/notices/${noticeId}/bookmark`,
  );
  return unwrapResponse(response.data);
};
