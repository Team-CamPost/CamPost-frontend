import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "../../../shared/api/notice";
import { getBackendDeptCodeByDepartmentId } from "../../../shared/constants/departments";
import { NoticeCard } from "./NoticeCard";
import type { NoticeCardData } from "../types/notice";

export const TrendingNotices = () => {
  const { departmentId = "sw" } = useParams();
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

  if (isPending) {
    return (
      <section className="mb-16 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          적극 홍보 중인 공지
        </h2>
        <p className="mt-2 text-sm text-slate-500">로딩 중...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mb-16 rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h2 className="text-2xl font-bold tracking-tight text-rose-700">
          적극 홍보 중인 공지
        </h2>
        <p className="mt-2 text-sm text-rose-600">
          데이터를 불러오지 못했습니다:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </section>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <section className="mb-16 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          적극 홍보 중인 공지
        </h2>
        <p className="mt-2 text-sm text-slate-500">표시할 공지가 없습니다.</p>
      </section>
    );
  }

  const cardNotices: NoticeCardData[] = notices.map((notice) => ({
    id: String(notice.id),
    title: notice.title,
    category: notice.category || "미분류",
    date: formatDate(notice.date),
    dDay: undefined,
    isBookmarked: false,
  }));

  return (
    <section className="mb-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            적극 홍보 중인 공지
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            학과의 중요한 행사나 혜택을 놓치지 마세요! 🔥
          </p>
        </div>
        <Link
          to="#recent"
          className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-[#2046FF]"
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
