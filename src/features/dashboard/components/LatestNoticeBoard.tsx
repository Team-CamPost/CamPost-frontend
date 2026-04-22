import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LayoutGrid, List, Paperclip } from "lucide-react";
import { NoticeCard } from "./NoticeCard";
import { type Notice } from "../mockData";
import { ROUTES } from "../../../app/router/paths";

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
      .filter((notice) => notice.dDay !== undefined)
      .sort(
        (a, b) =>
          (a.dDay ?? Number.POSITIVE_INFINITY) -
          (b.dDay ?? Number.POSITIVE_INFINITY),
      );
  }

  return [...notices].sort((a, b) => parseDate(b.date) - parseDate(a.date));
};

export const LatestNoticeBoard = ({
  notices,
  filter,
}: LatestNoticeBoardProps) => {
  const { departmentId = "" } = useParams();
  const [view, setView] = useState<NoticeView>("card");

  const filteredNotices = useMemo(
    () => getFilteredNotices(notices, filter),
    [notices, filter],
  );

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
              view === "card"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="카드 보기"
            aria-pressed={view === "card"}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              view === "list"
                ? "bg-slate-900 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="리스트 보기"
            aria-pressed={view === "list"}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
          표시할 공지가 없습니다.
        </div>
      ) : view === "card" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              departmentId={departmentId}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {filteredNotices.map((notice, index) => (
            <Link
              key={notice.id}
              to={ROUTES.noticeDetail(departmentId, notice.id)}
              className={`group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50 ${
                index < filteredNotices.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                  {notice.category}
                </span>
                {notice.dDay !== undefined && (
                  <span className="shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
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
      )}
    </section>
  );
};
