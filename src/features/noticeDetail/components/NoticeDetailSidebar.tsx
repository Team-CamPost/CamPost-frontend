import { useState } from "react";
import {
  Bookmark,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Paperclip,
  Share2,
} from "lucide-react";
import type { ReactNode } from "react";
import { toBackendAssetUrl } from "../../../shared/utils/assets";
import type { NoticeAttachmentData, NoticeDetailData } from "../types";

interface NoticeDetailSidebarProps {
  notice: NoticeDetailData;
}

export const NoticeDetailSidebar = ({ notice }: NoticeDetailSidebarProps) => {
  const [isBookmarked, setIsBookmarked] = useState(notice.isBookmarked);
  const [prevNoticeId, setPrevNoticeId] = useState(notice.id);

  if (notice.id !== prevNoticeId) {
    setPrevNoticeId(notice.id);
    setIsBookmarked(notice.isBookmarked);
  }

  const handleBookmarkToggle = () => {
    setIsBookmarked((prev) => !prev);
  };

  return (
    <aside className="sticky top-24 flex shrink-0 flex-col gap-6 lg:w-[360px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50">
        <div className="mb-5 flex items-center gap-2">
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {notice.department}
          </span>
          <span className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            {notice.category}
          </span>
        </div>

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

        <div className="mb-8 flex flex-col gap-4 text-sm text-slate-600">
          <InfoRow
            icon={<Calendar size={16} />}
            label="등록일"
            value={notice.date}
          />
          <InfoRow
            icon={<Eye size={16} />}
            label="조회수"
            value={`${notice.views}`}
          />
          <InfoRow
            label="작성자"
            value={notice.author}
          />
          <InfoRow
            label="마감일"
            value={
              notice.deadlineTime
                ? `${notice.deadline} ${notice.deadlineTime}`
                : notice.deadline
            }
          />
          <InfoRow
            label="대상"
            value={notice.target}
            alignTop
          />
          <InfoRow
            label="신청방법"
            value={notice.applyMethod}
            alignTop
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={`group flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-all active:scale-[0.98] ${
              isBookmarked
                ? "bg-[#2046FF] text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
                : "bg-[#2046FF]/10 text-[#2046FF] hover:bg-[#2046FF]/20"
            }`}
          >
            <Bookmark
              size={20}
              className={`transition-colors ${isBookmarked ? "fill-current" : ""}`}
            />
            {isBookmarked ? "저장됨" : "북마크"}
          </button>

          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
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
      </section>

      {notice.attachments.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Paperclip size={18} />
              첨부파일
            </h2>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
              {notice.attachments.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {notice.attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
              />
            ))}
          </div>
        </section>
      )}
    </aside>
  );
};

interface InfoRowProps {
  icon?: ReactNode;
  label: string;
  value: string;
  alignTop?: boolean;
}

const InfoRow = ({ icon, label, value, alignTop = false }: InfoRowProps) => (
  <div
    className={`flex justify-between gap-4 ${alignTop ? "items-start" : "items-center"}`}
  >
    <span className="flex shrink-0 items-center gap-2 text-slate-500">
      {icon}
      {label}
    </span>
    <span className="text-right font-semibold text-slate-900">{value}</span>
  </div>
);

const AttachmentItem = ({
  attachment,
}: {
  attachment: NoticeAttachmentData;
}) => {
  const downloadUrl =
    attachment.sourceUrl ||
    (attachment.localPath ? toBackendAssetUrl(attachment.localPath) : "#");
  const isDownloadable = downloadUrl !== "#";
  const meta = [
    attachment.ext?.toUpperCase(),
    formatFileSize(attachment.fileSize),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noreferrer"
      aria-disabled={!isDownloadable}
      className={`group flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-colors ${
        isDownloadable
          ? "hover:border-[#2046FF]/30 hover:bg-[#2046FF]/5"
          : "pointer-events-none bg-slate-50 opacity-70"
      }`}
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-[#2046FF]">
        <FileText size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-900">
          {attachment.originalName}
        </span>
        {meta && (
          <span className="mt-1 block text-xs text-slate-500">{meta}</span>
        )}
        {attachment.parseOk !== null && (
          <span className="mt-2 block text-xs font-semibold text-slate-500">
            {attachment.parseOk ? "본문 추출 완료" : "본문 추출 실패"}
          </span>
        )}
      </span>
      {isDownloadable && (
        <Download
          size={17}
          className="mt-1 shrink-0 text-slate-400 group-hover:text-[#2046FF]"
        />
      )}
    </a>
  );
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
