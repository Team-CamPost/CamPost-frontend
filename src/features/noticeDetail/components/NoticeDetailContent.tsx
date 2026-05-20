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
            className="max-w-none text-[15px] leading-8 text-slate-700 [&_a]:font-semibold [&_a]:text-[#2046FF] [&_a]:underline-offset-4 [&_a:hover]:underline [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_img]:my-6 [&_img]:max-w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-100 [&_li]:my-1.5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:font-bold [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_td]:border [&_td]:border-slate-200 [&_td]:p-3 [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-3 [&_th]:text-left [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
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
