import { Link } from "react-router-dom";
import { Bookmark, Clock } from "lucide-react";
import { ROUTES } from "../../../app/router/paths";
import type { NoticeCardData } from "../types/notice";

interface NoticeCardProps {
  notice: NoticeCardData;
  departmentId: string;
}

export const NoticeCard = ({ notice, departmentId }: NoticeCardProps) => {
  return (
    <div className="group relative flex h-[300px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-[#2046FF]/30 hover:shadow-lg hover:shadow-[#2046FF]/10">
      <Link
        to={ROUTES.noticeDetail(departmentId, notice.id)}
        className="flex flex-1 flex-col"
      >
        {/* Thumbnail Area (Fixed Height) */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-slate-50">
          {/* Placeholder gradient matching Event-us visual style */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 transition-transform duration-500 group-hover:scale-105" />

          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex items-start justify-between">
              <span className="rounded border border-white bg-white/80 px-2 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-sm">
                {notice.category}
              </span>
              {notice.dDay !== undefined && (
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-sm ${notice.dDay < 0 ? "bg-slate-500" : "bg-orange-500"}`}
                >
                  {notice.dDay < 0 ? "마감" : `D-${notice.dDay}`}
                </span>
              )}
            </div>

            {/* Optional: Add visual placeholder for image/logo */}
            <div className="mt-auto mb-4 self-center opacity-10">
              <div className="h-12 w-12 rounded-full bg-slate-400"></div>
            </div>
          </div>
        </div>

        {/* Content Area (Fixed Height to maintain identical card sizes) */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 line-clamp-2 text-base leading-tight font-bold text-slate-900 transition-colors group-hover:text-[#2046FF]">
            {notice.title}
          </h3>

          {/* Fill remaining space so footer is always at the bottom */}
          <div className="flex-1" />

          {/* Footer Area */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Clock size={14} />
              {notice.date}
            </div>

            {/* Placeholder to keep layout spacing for the absolute positioned button */}
            <div className="h-4 w-4" />
          </div>
        </div>
      </Link>

      {/* Bookmark Button as a sibling to Link to avoid nested interactive elements */}
      <button
        className="absolute right-5 bottom-5 z-10 text-slate-300 transition-colors hover:text-[#2046FF]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          // Bookmark logic will go here
        }}
        aria-label="북마크"
        aria-pressed={notice.isBookmarked}
      >
        <Bookmark
          size={16}
          fill={notice.isBookmarked ? "currentColor" : "none"}
          className={notice.isBookmarked ? "text-[#2046FF]" : ""}
        />
      </button>
    </div>
  );
};
