import { useMemo } from "react";
import {
  rewriteNoticeAssetUrls,
  sanitizeNoticeHtml,
} from "../../../shared/utils/assets";
import type { NoticeDetailData } from "../types";

interface NoticeDetailContentProps {
  notice: NoticeDetailData;
}

export const NoticeDetailContent = ({ notice }: NoticeDetailContentProps) => {
  const bodyText = notice.bodyText.trim();
  const html = notice.contentHtml || notice.bodyHtml;
  const renderedHtml = useMemo(
    () => sanitizeNoticeHtml(rewriteNoticeAssetUrls(html, notice.originalUrl)),
    [html, notice.originalUrl],
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <section className="min-h-[520px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <h2 className="mb-8 text-2xl leading-snug font-extrabold text-slate-900">
          {notice.title}
        </h2>

        {renderedHtml ? (
          <div
            className="notice-detail-html"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : bodyText ? (
          <p className="text-[15px] leading-8 whitespace-pre-wrap text-slate-700">
            {bodyText}
          </p>
        ) : (
          <p className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
            본문 데이터가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
};
