import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "../../../shared/api/notice";
import { getBackendDeptCodeByDepartmentId } from "../../../shared/constants/departments";
import { NoticeCard } from "./NoticeCard";
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

  if (isPending) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-bold text-slate-800">
          긴급 / 마감 임박
        </h2>
        <p className="text-sm text-slate-500">로딩 중...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5">
        <h2 className="mb-2 text-lg font-bold text-rose-700">
          긴급 / 마감 임박
        </h2>
        <p className="text-sm text-rose-600">
          데이터를 불러오지 못했습니다:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </section>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-bold text-slate-800">
          긴급 / 마감 임박
        </h2>
        <p className="text-sm text-slate-500">마감 임박 공지가 없습니다.</p>
      </section>
    );
  }

  const cardNotices: NoticeCardData[] = notices.map((notice) => ({
    id: String(notice.id),
    title: notice.title,
    category: notice.category || "미분류",
    date: formatDate(notice.date),
    dDay: getDDay(notice.deadline ?? notice.date) ?? undefined,
    isBookmarked: false,
  }));

  return (
    <section className="mt-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            마감 임박 공지
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            시간이 얼마 남지 않았어요! 서둘러 확인하세요.
          </p>
        </div>
        <Link
          to="#all"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-[#2046FF]"
        >
          더보기
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {cardNotices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            departmentId={departmentId}
          />
        ))}
      </div>
    </section>
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

  const diffMs = targetDate.getTime() - baseDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};
