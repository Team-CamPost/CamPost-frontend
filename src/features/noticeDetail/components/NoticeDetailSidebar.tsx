import { useState } from "react";
import { Calendar, ExternalLink, Share2, Bookmark, Eye } from "lucide-react";
import type { NoticeDetailData } from "../types";

interface NoticeDetailSidebarProps {
  notice: NoticeDetailData;
}

export const NoticeDetailSidebar = ({ notice }: NoticeDetailSidebarProps) => {
  // 북마크 상태 관리를 위한 로컬 state (API 연동 전 UI 피드백용)
  const [isBookmarked, setIsBookmarked] = useState(notice.isBookmarked);
  const [prevNoticeId, setPrevNoticeId] = useState(notice.id);

  // ESLint 에러 해결: notice prop이 변경될 때 렌더링 단계에서 직접 상태를 동기화합니다.
  // (React 공식 문서 권장 패턴: Adjusting some state when a prop changes)
  if (notice.id !== prevNoticeId) {
    setPrevNoticeId(notice.id);
    setIsBookmarked(notice.isBookmarked);
  }

  const handleBookmarkToggle = () => {
    // 차후 API 호출 로직 추가 (Optimistic update)
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="sticky top-24 flex shrink-0 flex-col gap-6 lg:w-[360px]">
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

        {notice.tags.length > 0 && (
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
        )}

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
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500">
              작성자
            </span>
            <span className="font-semibold text-slate-900">
              {notice.author}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-500">
              마감일
            </span>
            <span className="font-semibold text-slate-900">
              {notice.deadline}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="flex shrink-0 items-center gap-2 text-slate-500">
              대상
            </span>
            <span className="text-right font-semibold text-slate-900">
              {notice.target}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="flex shrink-0 items-center gap-2 text-slate-500">
              신청방법
            </span>
            <span className="text-right font-semibold text-slate-900">
              {notice.applyMethod}
            </span>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleBookmarkToggle}
            className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-[0.98] ${
              isBookmarked
                ? "bg-[#2046FF] text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl" // 저장됨 상태 (쨍한 파란색)
                : "bg-[#2046FF]/10 text-[#2046FF] hover:bg-[#2046FF]/20" // 기본 상태 (은은한 파란색)
            }`}
          >
            <Bookmark
              size={20}
              className={`transition-colors ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "저장됨" : "북마크"}
          </button>

          <div className="mt-1 flex items-center gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50">
              <Share2 size={18} /> 공유
            </button>
            <a
              href={notice.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#2046FF]"
            >
              원문 이동 <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
