import { Paperclip, Bookmark } from "lucide-react";
import { URGENT_NOTICES } from "../mockData";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../app/router/paths";

export const UrgentNotices = () => {
  const { departmentId = "" } = useParams();

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <h2 className="text-lg font-bold text-slate-800">긴급 / 마감 임박</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {URGENT_NOTICES.map((notice) => (
          <Link
            key={notice.id}
            to={ROUTES.noticeDetail(departmentId, notice.id)}
            className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#2046FF]/30 hover:shadow-md"
          >
            {/* Top row: Badges and Icons */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                {notice.dDay !== undefined && (
                  <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold tracking-tight text-white">
                    D-{notice.dDay}
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  {notice.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                {notice.hasAttachment && <Paperclip size={16} />}
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                    notice.isBookmarked
                      ? "bg-blue-50 text-[#2046FF]"
                      : "bg-slate-50 hover:bg-slate-100 hover:text-slate-600"
                  }`}
                >
                  <Bookmark
                    size={14}
                    fill={notice.isBookmarked ? "currentColor" : "none"}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <h3 className="mb-2 line-clamp-1 text-base font-bold text-slate-900 transition-colors group-hover:text-[#2046FF]">
              {notice.title}
            </h3>
            {notice.summary && (
              <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {notice.summary}
              </p>
            )}

            {/* Bottom row: Date */}
            <div className="mt-auto flex items-center justify-end text-xs font-medium text-slate-400">
              {notice.date}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
