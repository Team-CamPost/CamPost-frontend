import { Link, useParams } from "react-router-dom";
import { URGENT_NOTICES } from "../mockData";
import { ROUTES } from "../../../app/router/paths";
import { ChevronRight } from "lucide-react";

export const TrendingNotices = () => {
  const { departmentId = "" } = useParams();

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
          to={`#all`}
          className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-[#2046FF]"
        >
          더 많은 공지 보기 <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {URGENT_NOTICES.map((notice, index) => (
          <Link
            key={notice.id}
            to={ROUTES.noticeDetail(departmentId, notice.id)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2046FF]/10"
          >
            {/* Image Placeholder (Thumbnail) */}
            <div
              className={`flex h-40 w-full flex-col justify-between p-6 ${index % 2 === 0 ? "bg-blue-50" : "bg-indigo-50"}`}
            >
              <div className="flex items-start justify-between">
                <span className="rounded border border-white bg-white/60 px-2 py-1 text-xs font-bold text-[#2046FF] backdrop-blur-sm">
                  {notice.category}
                </span>
                {notice.dDay !== undefined && (
                  <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    D-{notice.dDay}
                  </span>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col p-6">
              <h3 className="mb-2 line-clamp-2 text-lg leading-tight font-bold text-slate-900 transition-colors group-hover:text-[#2046FF]">
                {notice.title}
              </h3>
              {notice.summary && (
                <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-500">
                  {notice.summary}
                </p>
              )}
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs font-medium text-slate-400">
                  작성일 {notice.date}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
