import type { NoticeDetailData } from "../types";

interface NoticeDetailContentProps {
  notice: NoticeDetailData;
}

export const NoticeDetailContent = ({ notice }: NoticeDetailContentProps) => {
  const bodyText = notice.bodyText.trim();

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      {/* 포스터/대표 이미지 영역 (가상의 빈 박스) */}
      <div className="relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-10 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 opacity-50" />
        <div className="z-10 flex flex-col items-center text-center">
          <span className="mb-4 text-6xl drop-shadow-md">🖼️</span>
          <p className="font-medium text-slate-400">
            크롤링 된 원문 이미지가 표시되는 영역입니다.
          </p>
        </div>
      </div>

      {/* 텍스트 본문 영역 */}
      <div className="prose prose-slate min-h-[400px] max-w-none rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <h3 className="mb-6 text-xl font-bold text-slate-800">
          {notice.title}
        </h3>
        {bodyText ? (
          <p className="leading-relaxed whitespace-pre-wrap text-slate-600">
            {bodyText}
          </p>
        ) : (
          <p className="leading-relaxed text-slate-500">
            본문 데이터가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
};
