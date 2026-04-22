import axios from "axios";
import { API_BASE_URL } from "../config/env";
import type { ApiResponse } from "../types/api";
import type {
  NoticeDto,
  NoticeSortBy,
} from "../../features/dashboard/types/notice";
import type { NoticeDetailDto } from "../../features/noticeDetail/types";

const noticeApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface FetchNoticesParams {
  deptCode?: string;
  sortBy?: NoticeSortBy;
  limit?: number;
}

export const fetchNotices = async ({
  deptCode,
  sortBy = "recent",
  limit = 4,
}: FetchNoticesParams): Promise<NoticeDto[]> => {
  const response = await noticeApiClient.get<ApiResponse<NoticeDto[]>>(
    "/api/v1/notices",
    {
      params: {
        deptCode: deptCode?.trim() || undefined,
        sortBy,
        limit,
      },
    },
  );

  if (!response.data.isSuccess) {
    throw new Error(`${response.data.code}: ${response.data.message}`);
  }

  return response.data.result;
};

export const fetchNoticeDetail = async (
  noticeId: number,
): Promise<NoticeDetailDto> => {
  const response = await noticeApiClient.get<ApiResponse<NoticeDetailDto>>(
    `/api/v1/notices/${noticeId}`,
  );

  if (!response.data.isSuccess) {
    throw new Error(`${response.data.code}: ${response.data.message}`);
  }

  return response.data.result;
};
