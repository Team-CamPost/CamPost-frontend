import { Clock3 } from "lucide-react";
import { NoticeCard } from "../../features/dashboard/components/NoticeCard";
import type { NoticeCardData } from "../../features/dashboard/types/notice";
import { getDepartmentIdByName } from "../../shared/constants/departments";
import { useRecentlyViewedNotices } from "../../shared/hooks/useRecentlyViewedNotices";
import { formatDate, getDDay } from "../../shared/utils/date";

export const RecentNoticesPage = () => {
  const recentNotices = useRecentlyViewedNotices();

  return (
    <main className="w-full pb-20">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2046FF]/10 text-[#2046FF]">
          <Clock3 size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            최근 본 공지
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            최근에 확인한 공지를 모아봅니다.
          </p>
        </div>
      </div>

      {recentNotices.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
          <Clock3
            size={32}
            className="mx-auto mb-3 text-slate-300"
          />
          <p className="font-semibold text-slate-700">
            아직 본 공지가 없습니다.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            공지를 열람하면 여기에 최근 본 순서로 쌓입니다.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recentNotices.map((notice) => {
            const cardData: NoticeCardData = {
              id: notice.id,
              title: notice.title,
              category: notice.category || "미분류",
              date: formatDate(notice.date),
              dDay: getDDay(notice.deadline) ?? undefined,
              isBookmarked: false,
              thumbnailUrl: notice.thumbnailPath ?? undefined,
            };
            return (
              <NoticeCard
                key={notice.id}
                notice={cardData}
                departmentId={getDepartmentIdByName(notice.department)}
              />
            );
          })}
        </div>
      )}
    </main>
  );
};
