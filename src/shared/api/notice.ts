import { apiClient } from "./client";
import type { ApiResponse } from "../types/api";
import type {
  NoticeDto,
  NoticeSortBy,
} from "../../features/dashboard/types/notice";
import type { NoticeDetailDto } from "../../features/noticeDetail/types";

// 공지 조회는 공개 엔드포인트지만, 로그인 상태면 JWT를 함께 보내 isBookmarked를
// 채워 받기 위해 토큰을 자동 첨부하는 apiClient를 사용한다. (선택적 인증)
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
  const response = await apiClient.get<ApiResponse<NoticeDto[]>>(
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
  const response = await apiClient.get<ApiResponse<NoticeDetailDto>>(
    `/api/v1/notices/${noticeId}`,
  );

  if (!response.data.isSuccess) {
    throw new Error(`${response.data.code}: ${response.data.message}`);
  }

  return response.data.result;
};
