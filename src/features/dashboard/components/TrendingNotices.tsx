import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "../../../shared/api/notice";
import {
  DEFAULT_DEPARTMENT_ID,
  getBackendDeptCodeByDepartmentId,
} from "../../../shared/constants/departments";
import { formatDate } from "../../../shared/utils/date";
import { NoticeSection } from "./NoticeSection";
import type { NoticeCardData } from "../types/notice";

export const TrendingNotices = () => {
  const { departmentId = DEFAULT_DEPARTMENT_ID } = useParams();
  const backendDeptCode = getBackendDeptCodeByDepartmentId(departmentId);

  const {
    data: notices,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notices", "trending", departmentId, backendDeptCode],
    queryFn: () =>
      fetchNotices({
        deptCode: backendDeptCode,
        sortBy: "recent",
        limit: 4,
      }),
  });

  const cardNotices: NoticeCardData[] = (notices || []).map((notice) => ({
    id: String(notice.id),
    title: notice.title,
    category: notice.category || "미분류",
    date: formatDate(notice.date),
    dDay: undefined,
    isBookmarked: false,
    thumbnailUrl: notice.thumbnailPath ?? undefined,
  }));

  return (
    <NoticeSection
      title="적극 홍보 중인 공지"
      description="학과의 중요한 행사나 혜택을 놓치지 마세요!"
      departmentId={departmentId}
      notices={cardNotices}
      viewAllLink="#recent"
      emptyMessage="현재 적극 홍보 중인 공지가 없어요!"
      isLoading={isPending}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : "Unknown error"}
    />
  );
};
