import { Calendar, ExternalLink, Share2, Bookmark, Eye } from "lucide-react";
import type { NoticeDetailData } from "../types";

interface NoticeDetailSidebarProps {
  notice: NoticeDetailData;
}

export const NoticeDetailSidebar = ({ notice }: NoticeDetailSidebarProps) => {
  return (
    <div className="sticky top-24 flex shrink-0 flex-col gap-6 lg:w-[380px]">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
        {/* 카테고리 태그 */}
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {notice.department}
          </span>
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {notice.category}
          </span>
        </div>

        {/* 제목 */}
        <h1 className="mb-4 text-[22px] leading-snug font-extrabold tracking-tight text-slate-900">
          {notice.title}
        </h1>

        {/* 해시태그 */}
        <div className="mb-8 flex flex-wrap gap-1.5">
          {notice.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-[#2046FF]/5 px-2 py-1 text-xs font-semibold text-[#2046FF]/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <hr className="mb-6 border-slate-100" />

        {/* 메타 정보 */}
        <div className="mb-8 flex flex-col gap-4 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500">
              <Calendar size={16} /> 등록일
            </span>
            <span className="font-semibold text-slate-900">{notice.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500">
              <Eye size={16} /> 조회수
            </span>
            <span className="font-semibold text-slate-900">
              {notice.views}회
            </span>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-col gap-3">
          <a
            href={notice.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2046FF] py-4 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
          >
            원문 이동하기 <ExternalLink size={18} />
          </a>

          <div className="mt-1 flex items-center gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50">
              <Share2 size={18} /> 공유
            </button>
            <button className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500">
              <Bookmark
                size={18}
                className={`transition-colors ${notice.isBookmarked ? "fill-red-500 text-red-500" : "group-hover:text-red-500"}`}
              />{" "}
              관심 공지
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
