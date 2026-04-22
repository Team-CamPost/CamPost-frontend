import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HeroBannerCarousel } from "../../features/dashboard/components/HeroBannerCarousel";
import { TrendingNotices } from "../../features/dashboard/components/TrendingNotices";
import { UrgentNotices } from "../../features/dashboard/components/UrgentNotices";
import { LatestNoticeBoard } from "../../features/dashboard/components/LatestNoticeBoard";
import { fetchNotices } from "../../shared/api/notice";
import { getBackendDeptCodeByDepartmentId } from "../../shared/constants/departments";
import type { NoticeCardData } from "../../features/dashboard/types/notice";

type NoticeFilter = "recent" | "deadline";

interface LatestNoticeItem extends NoticeCardData {
  summary?: string;
  hasAttachment?: boolean;
}

export const DepartmentDashboardPage = () => {
  const { departmentId = "sw" } = useParams();
  const location = useLocation();
  const backendDeptCode = getBackendDeptCodeByDepartmentId(departmentId);

  const activeFilter: NoticeFilter | null =
    location.hash === "#deadline"
      ? "deadline"
      : location.hash === "#recent"
        ? "recent"
        : null;
  const showHeroBanner = activeFilter === null;

  const {
    data: latestNotices = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "notices",
      "latest-board",
      departmentId,
      backendDeptCode,
      activeFilter,
    ],
    queryFn: () =>
      fetchNotices({
        deptCode: backendDeptCode,
        sortBy: activeFilter === "deadline" ? "deadline" : "recent",
        limit: 40,
      }),
    enabled: activeFilter !== null,
    select: (notices): LatestNoticeItem[] =>
      notices.map((notice) => ({
        id: String(notice.id),
        title: notice.title,
        category: notice.category || "미분류",
        date: formatDate(notice.date),
        dDay: getDDay(notice.deadline ?? notice.date) ?? undefined,
        isBookmarked: false,
        summary: notice.target || undefined,
        hasAttachment: false,
      })),
  });

  return (
    <main className="w-full pb-20">
      {showHeroBanner && <HeroBannerCarousel />}

      <div
        id="recent"
        className="scroll-mt-24"
      />
      <div
        id="deadline"
        className="scroll-mt-24"
      />

      {activeFilter ? (
        isPending ? (
          <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-900">공지 목록</h2>
            <p className="mt-2 text-sm text-slate-500">
              데이터를 불러오는 중입니다...
            </p>
          </section>
        ) : isError ? (
          <section className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <h2 className="text-xl font-bold text-rose-700">공지 목록</h2>
            <p className="mt-2 text-sm text-rose-600">
              {error instanceof Error
                ? error.message
                : "데이터를 불러오지 못했습니다."}
            </p>
          </section>
        ) : (
          <LatestNoticeBoard
            key={activeFilter}
            notices={latestNotices}
            filter={activeFilter}
          />
        )
      ) : (
        <>
          <UrgentNotices />
          <TrendingNotices />
        </>
      )}
    </main>
  );
};

const formatDate = (value: string | null) => {
  if (!value) return "-";
  return value.replaceAll("-", ".");
};

const getDDay = (deadline: string | null) => {
  if (!deadline) return null;

  const today = new Date();
  const baseDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const targetDate = new Date(`${deadline}T00:00:00`);

  if (Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const diffMs = targetDate.getTime() - baseDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
