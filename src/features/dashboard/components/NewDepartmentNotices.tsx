import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "../../../shared/api/notice";
import { NoticeSection } from "./NoticeSection";
import type { NoticeCardData } from "../types/notice";

export const NewDepartmentNotices = () => {
  const { departmentId = "sw" } = useParams();

  const {
    data: notices,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notices", "new-department", "recent", 4],
    queryFn: () =>
      fetchNotices({
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
  }));

  return (
    <NoticeSection
      title="신규 학과 공지"
      description="전체 공지에서 가장 최신 등록 공지를 모아봤어요."
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

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return value.replaceAll("-", ".");
};
