import { useState } from "react";
import {
  Bookmark,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Image,
  Paperclip,
  Archive,
  Share2,
} from "lucide-react";
import type { ReactNode } from "react";
import { toBackendAssetUrl } from "../../../shared/utils/assets";
import type { NoticeAttachmentData, NoticeDetailData } from "../types";

interface NoticeDetailSidebarProps {
  notice: NoticeDetailData;
}

export const NoticeDetailSidebar = ({ notice }: NoticeDetailSidebarProps) => {
  const [bookmarkState, setBookmarkState] = useState({
    noticeId: notice.id,
    isBookmarked: notice.isBookmarked,
  });
  const attachments = buildVisibleAttachments(notice.attachments);
  const isBookmarked =
    bookmarkState.noticeId === notice.id
      ? bookmarkState.isBookmarked
      : notice.isBookmarked;

  const handleBookmarkToggle = () => {
    setBookmarkState({
      noticeId: notice.id,
      isBookmarked: !isBookmarked,
    });
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
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-[#2046FF]"
            >
              원문 이동 <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </section>

      {attachments.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Paperclip size={18} />
              첨부파일
            </h2>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
              {attachments.length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {attachments.map((attachment) => (
              <AttachmentItem
                key={`${attachment.id}:${attachment.fileKey}`}
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
  const previewUrl =
    !attachment.isPreviewFile && attachment.conversionStatus === "success"
      ? (attachment.previewPdfR2Url ??
        toBackendAssetUrl(attachment.previewPdfPath))
      : "";
  const downloadUrl =
    attachment.r2Url ||
    (attachment.localPath ? toBackendAssetUrl(attachment.localPath) : "") ||
    attachment.sourceUrl ||
    "";
  const hasPdfPreview = Boolean(previewUrl);
  const isDownloadable = Boolean(downloadUrl);
  const meta = [
    attachment.ext?.toUpperCase(),
    formatFileSize(attachment.fileSize),
  ]
    .filter(Boolean)
    .join(" · ");
  const isImage = isImageAttachment(attachment);
  const isArchive = isArchiveAttachment(attachment);
  const statusLabel = getAttachmentStatusLabel(attachment);

  const content = (
    <>
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-white group-hover:text-[#2046FF]">
        {isImage ? (
          <Image size={18} />
        ) : isArchive ? (
          <Archive size={18} />
        ) : (
          <FileText size={18} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-slate-900">
          {attachment.originalName}
        </span>
        {meta && (
          <span className="mt-1 block text-xs text-slate-500">{meta}</span>
        )}
        {statusLabel && (
          <span className="mt-2 block text-xs font-semibold text-slate-500">
            {statusLabel}
          </span>
        )}
      </span>
    </>
  );

  const className =
    "group flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition-colors";

  if (!isDownloadable && !hasPdfPreview) {
    return (
      <div
        aria-disabled="true"
        className={`${className} bg-slate-50 opacity-70`}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`${className} hover:border-[#2046FF]/30 hover:bg-[#2046FF]/5`}
    >
      {content}
      <span className="flex shrink-0 flex-col gap-2">
        {hasPdfPreview && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-xl border border-[#2046FF]/20 px-2.5 text-xs font-bold whitespace-nowrap text-[#2046FF] transition-colors hover:border-[#2046FF]/40 hover:bg-white"
            title="PDF 미리보기"
          >
            <Eye size={14} />
            PDF
          </a>
        )}
        {isDownloadable && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center justify-center rounded-xl border border-slate-200 px-2.5 text-slate-500 transition-colors hover:border-slate-300 hover:bg-white hover:text-[#2046FF]"
            title="다운로드"
          >
            <Download size={15} />
          </a>
        )}
      </span>
    </div>
  );
};

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "bmp",
  "svg",
]);

const ARCHIVE_EXTENSIONS = new Set(["zip", "7z", "rar", "tar", "gz"]);

const buildVisibleAttachments = (attachments: NoticeAttachmentData[]) =>
  attachments.flatMap((attachment) => {
    if (
      attachment.conversionStatus !== "success" ||
      !attachment.previewPdfPath
    ) {
      return [attachment];
    }

    return [
      {
        ...attachment,
        previewPdfPath: null,
        previewPdfSize: null,
        previewPdfChecksum: null,
      },
      {
        ...attachment,
        id: -attachment.id,
        fileKey: `${attachment.fileKey || attachment.id}:preview-pdf`,
        originalName: toPreviewPdfName(attachment.originalName),
        ext: "pdf",
        fileType: "document",
        mimeType: "application/pdf",
        fileSize: attachment.previewPdfSize,
        checksum: attachment.previewPdfChecksum,
        sourceUrl: null,
        localPath: attachment.previewPdfPath,
        downloadOk: true,
        extractedText: null,
        extractedChars: null,
        parser: null,
        parseQuality: null,
        parseOk: null,
        downloadCached: null,
        previewPdfPath: null,
        previewPdfSize: null,
        previewPdfChecksum: null,
        conversionStatus: null,
        conversionError: null,
        isPreviewFile: true,
      },
    ];
  });

const toPreviewPdfName = (name: string) => {
  const trimmed = name.trim() || "attachment";
  const dotIndex = trimmed.lastIndexOf(".");
  if (dotIndex <= 0) return `${trimmed}.preview.pdf`;
  return `${trimmed.slice(0, dotIndex)}.preview.pdf`;
};

const isImageAttachment = (attachment: NoticeAttachmentData) =>
  attachment.fileType?.toLowerCase() === "image" ||
  attachment.mimeType?.toLowerCase().startsWith("image/") ||
  IMAGE_EXTENSIONS.has(attachment.ext?.toLowerCase() ?? "");

const isArchiveAttachment = (attachment: NoticeAttachmentData) =>
  attachment.fileType?.toLowerCase() === "archive" ||
  ARCHIVE_EXTENSIONS.has(attachment.ext?.toLowerCase() ?? "");

const getAttachmentStatusLabel = (attachment: NoticeAttachmentData) => {
  if (attachment.isPreviewFile) return "PDF preview file";
  if (
    attachment.conversionStatus === "success" &&
    Boolean(attachment.previewPdfPath)
  ) {
    return "PDF 미리보기 가능";
  }
  if (isImageAttachment(attachment)) return "이미지 파일";
  if (isArchiveAttachment(attachment)) return "압축파일";
  if (attachment.parseOk === null) return "";
  return attachment.parseOk ? "본문 추출 완료" : "본문 추출 실패";
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
