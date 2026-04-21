import { Star, TrendingUp } from "lucide-react";
import { RECOMMENDED_KEYWORDS, RECOMMENDED_NOTICES } from "../mockData";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../app/router/paths";

export const RightPanel = () => {
  const { departmentId = "" } = useParams();

  return (
    <aside className="flex flex-col gap-6">
      {/* Keywords Section */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Star
            size={18}
            className="text-[#2046FF]"
            fill="currentColor"
          />
          <h3 className="font-bold text-slate-800">관심 키워드 추천</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-[#2046FF]/30 hover:text-[#2046FF] hover:shadow"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Notices Section */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp
            size={18}
            className="text-orange-500"
          />
          <h3 className="font-bold text-slate-800">추천 공지</h3>
        </div>
        <div className="flex flex-col gap-3">
          {RECOMMENDED_NOTICES.map((notice) => (
            <Link
              key={notice.id}
              to={ROUTES.noticeDetail(departmentId, notice.id)}
              className="group flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#2046FF]/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#2046FF]">
                  {notice.category}
                </span>
              </div>
              <h4 className="line-clamp-2 text-sm leading-snug font-semibold text-slate-800 transition-colors group-hover:text-[#2046FF]">
                {notice.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
