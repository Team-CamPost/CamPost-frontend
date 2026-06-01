import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import { NoticeDetailContent } from "../../features/noticeDetail/components/NoticeDetailContent";
import { NoticeDetailRecommendations } from "../../features/noticeDetail/components/NoticeDetailRecommendations";
import { NoticeDetailSidebar } from "../../features/noticeDetail/components/NoticeDetailSidebar";
import type {
  NoticeAttachmentData,
  NoticeDetailData,
  NoticeDetailDto,
} from "../../features/noticeDetail/types";
import type { NoticeCardData } from "../../features/dashboard/types/notice";
import { fetchNoticeDetail, fetchNotices } from "../../shared/api/notice";
import {
  DEFAULT_DEPARTMENT_ID,
  getBackendDeptCodeByDepartmentId,
} from "../../shared/constants/departments";
import { formatDate, getDDay } from "../../shared/utils/date";

export const NoticeDetailPage = () => {
  const { departmentId = DEFAULT_DEPARTMENT_ID, noticeId = "" } = useParams();
  const backendDeptCode = getBackendDeptCodeByDepartmentId(departmentId);
  const parsedNoticeId = Number.parseInt(noticeId, 10);
  const hasValidNoticeId =
    Number.isFinite(parsedNoticeId) && parsedNoticeId > 0;

  const {
    data: noticeDetail,
    isPending: isDetailPending,
    isError: isDetailError,
    error: detailError,
  } = useQuery({
    queryKey: ["notice-detail", parsedNoticeId],
    queryFn: () => fetchNoticeDetail(parsedNoticeId),
    enabled: hasValidNoticeId,
  });

  const { data: recommendedNotices = [] } = useQuery({
    queryKey: [
      "notices",
      "recommendations",
      departmentId,
      backendDeptCode,
      parsedNoticeId,
    ],
    queryFn: () =>
      fetchNotices({
        deptCode: backendDeptCode,
        sortBy: "recent",
        limit: 8,
      }),
    enabled: Boolean(backendDeptCode),
    select: (notices): NoticeCardData[] =>
      notices
        .filter((notice) => notice.id !== parsedNoticeId)
        .slice(0, 4)
        .map((notice) => ({
          id: String(notice.id),
          title: notice.title,
          category: notice.category || "미분류",
          date: formatDate(notice.date),
          dDay: undefined,
          isBookmarked: false,
          thumbnailUrl: notice.thumbnailPath ?? undefined,
        })),
  });

  if (!hasValidNoticeId) {
    return (
      <main className="w-full pb-20">
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h1 className="text-lg font-bold text-rose-700">
            잘못된 공지 경로입니다.
          </h1>
          <p className="mt-2 text-sm text-rose-600">공지 ID를 확인해 주세요.</p>
        </section>
      </main>
    );
  }

  if (isDetailPending) {
    return (
      <main className="w-full pb-20">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-lg font-bold text-slate-800">공지 상세</h1>
          <p className="mt-2 text-sm text-slate-500">
            데이터를 불러오는 중입니다...
          </p>
        </section>
      </main>
    );
  }

  if (isDetailError || !noticeDetail) {
    return (
      <main className="w-full pb-20">
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h1 className="text-lg font-bold text-rose-700">
            공지를 불러오지 못했습니다.
          </h1>
          <p className="mt-2 text-sm text-rose-600">
            {detailError instanceof Error
              ? detailError.message
              : "알 수 없는 오류가 발생했습니다."}
          </p>
        </section>
      </main>
    );
  }

  const notice = toNoticeDetailData(noticeDetail);

  return (
    <main className="w-full pb-20">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Link
          to={ROUTES.departmentDashboard(departmentId)}
          className="transition-colors hover:text-[#2046FF]"
        >
          대시보드
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-slate-900">공지 상세</span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <NoticeDetailContent notice={notice} />
        <NoticeDetailSidebar notice={notice} />
      </div>

      <NoticeDetailRecommendations
        departmentId={departmentId}
        recommendedNotices={recommendedNotices}
      />
    </main>
  );
};

const toNoticeDetailData = (notice: NoticeDetailDto): NoticeDetailData => {
  const tags = [notice.department, notice.category].filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  const attachments: NoticeAttachmentData[] = (notice.attachments ?? []).map(
    (attachment) => ({
      id: attachment.id,
      fileKey: attachment.fileKey || "",
      originalName: attachment.originalName || "attachment",
      ext: attachment.ext,
      fileType: attachment.fileType,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,
      checksum: attachment.checksum,
      sourceUrl: attachment.sourceUrl,
      localPath: attachment.localPath,
      r2Url: attachment.r2Url,
      downloadOk: attachment.downloadOk,
      extractedText: attachment.extractedText,
      extractedChars: attachment.extractedChars,
      parser: attachment.parser,
      parseQuality: attachment.parseQuality,
      parseOk: attachment.parseOk,
      downloadCached: attachment.downloadCached,
      previewPdfPath: attachment.previewPdfPath,
      previewPdfR2Url: attachment.previewPdfR2Url,
      previewPdfSize: attachment.previewPdfSize,
      previewPdfChecksum: attachment.previewPdfChecksum,
      conversionStatus: attachment.conversionStatus,
      conversionEngine: attachment.conversionEngine,
      conversionError: attachment.conversionError,
      createdAt: attachment.createdAt,
    }),
  );

  return {
    id: String(notice.id),
    title: notice.title,
    category: notice.category || "미분류",
    department: notice.department || "학과 미정",
    date: formatDate(notice.date),
    deadline: formatDate(notice.deadline),
    deadlineTime: notice.deadlineTime ?? undefined,
    deadlineAt: notice.deadlineAt ?? undefined,
    dDay: getDDay(notice.deadline) ?? undefined,
    author: notice.author || "작성자 미상",
    target: notice.target || "제한 없음",
    applyMethod: notice.applyMethod || "별도 안내 없음",
    views: notice.views ?? 0,
    isBookmarked: false,
    bodyText: notice.bodyText || "",
    bodyHtml: notice.bodyHtml || "",
    contentHtml: notice.contentHtml || "",
    contentStats: notice.contentStats,
    attachments,
    originalUrl: notice.sourceUrl || "#",
    tags,
  };
};
