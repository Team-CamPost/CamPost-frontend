import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "../../../shared/api/notice";
import {
  DEFAULT_DEPARTMENT_ID,
  getBackendDeptCodeByDepartmentId,
} from "../../../shared/constants/departments";
import { formatDate, getDateSortValue } from "../../../shared/utils/date";
import { NoticeSection } from "./NoticeSection";
import type { NoticeCardData } from "../types/notice";

export const NewDepartmentNotices = () => {
  const { departmentId = DEFAULT_DEPARTMENT_ID } = useParams();
  const backendDeptCode = getBackendDeptCodeByDepartmentId(departmentId);

  const {
    data: notices,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notices", "new-department", "recent", departmentId, 4],
    queryFn: () =>
      fetchNotices({
        deptCode: backendDeptCode,
        sortBy: "recent",
        limit: 40,
      }),
  });

  const cardNotices: NoticeCardData[] = (notices || [])
    .slice()
    .sort((a, b) => getDateSortValue(b.date) - getDateSortValue(a.date))
    .slice(0, 4)
    .map((notice) => ({
      id: String(notice.id),
      title: notice.title,
      category: notice.category || "미분류",
      date: formatDate(notice.date),
      dDay: undefined,
      isBookmarked: false,
    }));

  return (
    <NoticeSection
      title="신규 학과 공지"
      description="현재 학과에서 가장 최신 등록된 공지를 모아봤어요."
      departmentId={departmentId}
      notices={cardNotices}
      viewAllLink="#recent"
      emptyMessage="현재 신규 학과 공지가 없어요!"
      isLoading={isPending}
      isError={isError}
      errorMessage={error instanceof Error ? error.message : "Unknown error"}
    />
  );
};
