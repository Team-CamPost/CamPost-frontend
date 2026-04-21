import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Paperclip } from "lucide-react";
import { ALL_NOTICES, type NoticeCategory } from "../mockData";
import { ROUTES } from "../../../app/router/paths";

const CATEGORIES: NoticeCategory[] = ["전체", "장학금", "채용", "행사", "학사"];

export const NoticeList = () => {
  const { departmentId = "" } = useParams();
  const [activeCategory, setActiveCategory] = useState<NoticeCategory>("전체");

  const filteredNotices = ALL_NOTICES.filter(
    (notice) => activeCategory === "전체" || notice.category === activeCategory,
  );

  return (
    <section className="mt-10">
      {/* Header and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-800">전체 공지</h2>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#2046FF] text-white shadow-md shadow-[#2046FF]/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, index) => (
            <Link
              key={notice.id}
              to={ROUTES.noticeDetail(departmentId, notice.id)}
              className={`group flex items-center justify-between p-4 transition-colors hover:bg-slate-50 ${
                index !== filteredNotices.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4 overflow-hidden">
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-xs font-medium ${
                    notice.dDay !== undefined
                      ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {notice.dDay !== undefined
                    ? `D-${notice.dDay}`
                    : notice.category}
                </span>
                <span className="truncate text-sm font-medium text-slate-800 transition-colors group-hover:text-[#2046FF]">
                  {notice.title}
                </span>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-4">
                {notice.hasAttachment && (
                  <Paperclip
                    size={16}
                    className="text-slate-400"
                  />
                )}
                <span className="w-20 text-right text-xs font-medium text-slate-400">
                  {notice.date}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <span className="mb-3 text-4xl">📭</span>
            <p className="text-sm">해당 카테고리의 공지가 없습니다.</p>
          </div>
        )}
      </div>

      {/* Load More Button (Mock) */}
      {filteredNotices.length > 0 && (
        <button className="mt-4 w-full rounded-xl border border-transparent bg-slate-50 py-3 text-sm font-medium text-[#2046FF] transition-colors hover:border-[#2046FF]/10 hover:bg-[#2046FF]/5">
          더보기
        </button>
      )}
    </section>
  );
};
