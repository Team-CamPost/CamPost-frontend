import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock3, LayoutGrid, List, Paperclip } from "lucide-react";
import { NoticeCard } from "./NoticeCard";
import { type Notice } from "../mockData";
import { ROUTES } from "../../../app/router/paths";
import { getCategoryTone, isDeadlineSoon } from "../utils/noticeStyle";

type NoticeFilter = "recent" | "deadline";
type NoticeView = "card" | "list";

interface LatestNoticeBoardProps {
  notices: Notice[];
  filter: NoticeFilter;
}

const parseDate = (value: string) => {
  const parsed = Date.parse(value.replace(/\./g, "-"));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getFilteredNotices = (notices: Notice[], filter: NoticeFilter) => {
  if (filter === "deadline") {
    return notices
      .filter((notice) => isDeadlineSoon(notice))
      .sort((a, b) => {
        const dDayGap =
          (a.dDay ?? Number.POSITIVE_INFINITY) -
          (b.dDay ?? Number.POSITIVE_INFINITY);

        if (dDayGap !== 0) {
          return dDayGap;
        }

        return parseDate(b.date) - parseDate(a.date);
      });
  }

  return [...notices].sort((a, b) => parseDate(b.date) - parseDate(a.date));
};

export const LatestNoticeBoard = ({
  notices,
  filter,
}: LatestNoticeBoardProps) => {
  const { departmentId = "" } = useParams();
  const [view, setView] = useState<NoticeView>("card");
  const resolvedView = view;

  const filteredNotices = useMemo(
    () => getFilteredNotices(notices, filter),
    [notices, filter],
  );
  const featuredNotice = useMemo(
    () =>
      [...filteredNotices]
        .filter((notice) => notice.dDay !== undefined)
        .sort(
          (a, b) =>
            (a.dDay ?? Number.POSITIVE_INFINITY) -
            (b.dDay ?? Number.POSITIVE_INFINITY),
        )[0],
    [filteredNotices],
  );
  const remainingNotices = featuredNotice
    ? filteredNotices.filter((notice) => notice.id !== featuredNotice.id)
    : filteredNotices;

  const title =
    filter === "deadline" ? "마감 임박 공지사항" : "최신 학과 공지사항";
  const description =
    filter === "deadline"
      ? "마감이 가까운 공지를 우선 확인하세요."
      : "최근 등록된 공지를 빠르게 확인하세요.";

  return (
    <section className="mt-10 scroll-mt-24">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
            SW CONVERGENCE COLLEGE
          </p>
          <h2 className="mt-1 text-3xl leading-tight font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setView("card")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              resolvedView === "card"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="카드 보기"
            aria-pressed={resolvedView === "card"}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              resolvedView === "list"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="리스트 보기"
            aria-pressed={resolvedView === "list"}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
          표시할 공지가 없습니다.
        </div>
      ) : resolvedView === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
          {featuredNotice && (
            <Link
              to={ROUTES.noticeDetail(departmentId, featuredNotice.id)}
              className="group flex h-[300px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2046FF]/30 hover:shadow-lg hover:shadow-[#2046FF]/10 xl:col-span-2"
            >
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`rounded-lg border px-3 py-1 text-xs font-bold ${getCategoryTone(featuredNotice.category)}`}
                  >
                    {featuredNotice.category}
                  </span>
                  {isDeadlineSoon(featuredNotice) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600">
                      <Clock3 size={14} />
                      D-{featuredNotice.dDay} 마감임박
                    </span>
                  )}
                </div>

                <h3 className="line-clamp-2 text-3xl leading-tight font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-[#2046FF]">
                  {featuredNotice.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                  {featuredNotice.summary ??
                    "마감이 임박한 공지입니다. 자세한 내용을 확인해 제출 일정을 놓치지 마세요."}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock3 size={14} />
                {featuredNotice.date}
              </div>
            </Link>
          )}

          {remainingNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              departmentId={departmentId}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {featuredNotice && (
            <Link
              to={ROUTES.noticeDetail(departmentId, featuredNotice.id)}
              className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-[#2046FF]/30 hover:shadow-lg hover:shadow-[#2046FF]/10"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span
                  className={`rounded-lg border px-3 py-1 text-xs font-bold ${getCategoryTone(featuredNotice.category)}`}
                >
                  {featuredNotice.category}
                </span>
                {isDeadlineSoon(featuredNotice) && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-600">
                    <Clock3 size={14} />
                    D-{featuredNotice.dDay} 마감임박
                  </span>
                )}
              </div>
              <h3 className="line-clamp-2 text-2xl leading-tight font-extrabold text-slate-900 transition-colors group-hover:text-[#2046FF]">
                {featuredNotice.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {featuredNotice.summary ??
                  "마감이 임박한 공지입니다. 자세한 내용을 확인해 제출 일정을 놓치지 마세요."}
              </p>
            </Link>
          )}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {remainingNotices.map((notice, index) => (
              <Link
                key={notice.id}
                to={ROUTES.noticeDetail(departmentId, notice.id)}
                className={`group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 ${
                  index < remainingNotices.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`shrink-0 rounded-md border px-2 py-1 text-xs font-semibold ${getCategoryTone(notice.category)}`}
                  >
                    {notice.category}
                  </span>
                  {isDeadlineSoon(notice) && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                      <Clock3 size={12} />
                      D-{notice.dDay}
                    </span>
                  )}
                  <span className="truncate text-sm font-medium text-slate-800 group-hover:text-[#2046FF]">
                    {notice.title}
                  </span>
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-4 text-xs text-slate-500">
                  {notice.hasAttachment && <Paperclip size={14} />}
                  <span>{notice.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
