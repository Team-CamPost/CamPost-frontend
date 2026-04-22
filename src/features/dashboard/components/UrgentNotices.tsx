import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "../../../shared/api/notice";
import { getBackendDeptCodeByDepartmentId } from "../../../shared/constants/departments";
import { formatDate, getDDay } from "../../../shared/utils/date";
import { NoticeSection } from "./NoticeSection";
import type { NoticeCardData } from "../types/notice";

export const UrgentNotices = () => {
  const { departmentId = "sw" } = useParams();
  const backendDeptCode = getBackendDeptCodeByDepartmentId(departmentId);

  const {
    data: notices,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notices", "urgent", departmentId, backendDeptCode],
    queryFn: () =>
      fetchNotices({
        deptCode: backendDeptCode,
        sortBy: "deadline",
        limit: 4,
      }),
  });

  const cardNotices: NoticeCardData[] = (notices || []).map((notice) => ({
    id: String(notice.id),
    title: notice.title,
    category: notice.category || "미분류",
    date: formatDate(notice.date),
    dDay: getDDay(notice.deadline) ?? undefined,
    isBookmarked: false,
  }));

  return (
    <NoticeSection
      title="마감 임박 공지"
      description="시간이 얼마 남지 않았어요! 서둘러 확인하세요."
      departmentId={departmentId}
      notices={cardNotices}
      viewAllLink="#deadline"
      emptyMessage="현재 마감 임박 공지가 없어요!"
      isLoading={isPending}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : "Unknown error"}
    />
  );
};
