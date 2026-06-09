import { useQuery } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { NoticeCard } from "../../features/dashboard/components/NoticeCard";
import type { NoticeCardData } from "../../features/dashboard/types/notice";
import { fetchBookmarkedNotices } from "../../shared/api/bookmark";
import { getDepartmentIdByName } from "../../shared/constants/departments";
import { useAuth } from "../../shared/hooks/useAuth";
import { formatDate, getDDay } from "../../shared/utils/date";

export const BookmarksPage = () => {
  const { isAuthenticated } = useAuth();

  const {
    data: notices = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["bookmarked-notices"],
    queryFn: () => fetchBookmarkedNotices(),
    enabled: isAuthenticated,
  });

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-8 lg:px-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2046FF]/10 text-[#2046FF]">
            <Bookmark size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              북마크한 공지
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              저장한 공지를 모아봅니다.
            </p>
          </div>
        </div>

        {isPending ? (
          <p className="text-sm text-slate-500">불러오는 중입니다...</p>
        ) : isError ? (
          <p className="text-sm text-rose-600">
            북마크 목록을 불러오지 못했습니다.
          </p>
        ) : notices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
            <Bookmark
              size={32}
              className="mx-auto mb-3 text-slate-300"
            />
            <p className="font-semibold text-slate-700">
              아직 북마크한 공지가 없습니다.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              공지 상세 페이지에서 북마크를 눌러 저장해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {notices.map((notice) => {
              const cardData: NoticeCardData = {
                id: String(notice.id),
                title: notice.title,
                category: notice.category || "미분류",
                date: formatDate(notice.date),
                dDay: getDDay(notice.deadline) ?? undefined,
                isBookmarked: true,
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
      </div>
    </main>
  );
};
