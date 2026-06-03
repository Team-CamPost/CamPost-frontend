import { useEffect, useMemo, useState } from "react";
import { Calendar, Eye } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ROUTES } from "../../../app/router/paths";
import { fetchNotices } from "../../../shared/api/notice";
import {
  DEFAULT_DEPARTMENT_ID,
  getBackendDeptCodeByDepartmentId,
} from "../../../shared/constants/departments";
import { formatDate, getDDay } from "../../../shared/utils/date";
import type { NoticeDto } from "../types/notice";

const BANNER_LIMIT = 3;
const BACKGROUNDS = [
  "from-[#2046FF] via-[#4064FF] to-slate-900",
  "from-emerald-600 via-teal-600 to-slate-900",
  "from-rose-600 via-orange-500 to-slate-900",
];

interface BannerNotice {
  id: string;
  title: string;
  description: string;
  category: string;
  dateLabel: string;
  dDay?: number;
  views: number;
  bgColor: string;
  mode: "deadline" | "popular";
}

const toBannerNotice = (
  notice: NoticeDto,
  index: number,
  mode: BannerNotice["mode"],
): BannerNotice => {
  const dDay = getDDay(notice.deadline);
  const deadlineLabel = notice.deadline
    ? `${formatDate(notice.deadline)} 마감`
    : `${formatDate(notice.date)} 게시`;

  return {
    id: String(notice.id),
    title: notice.title,
    description:
      notice.target ||
      notice.applyMethod ||
      notice.category ||
      "공지 상세 내용을 확인해 주세요.",
    category: notice.category || "미분류",
    dateLabel: deadlineLabel,
    dDay: dDay ?? undefined,
    views: notice.views ?? 0,
    bgColor: BACKGROUNDS[index % BACKGROUNDS.length],
    mode,
  };
};

const buildBannerNotices = (
  deadlineNotices: NoticeDto[],
  recentNotices: NoticeDto[],
) => {
  const selected = new Map<string, BannerNotice>();

  deadlineNotices
    .filter((notice) => getDDay(notice.deadline) !== null)
    .slice(0, BANNER_LIMIT)
    .forEach((notice) => {
      selected.set(
        notice.articleId,
        toBannerNotice(notice, selected.size, "deadline"),
      );
    });

  if (selected.size < BANNER_LIMIT) {
    recentNotices
      .slice()
      .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
      .forEach((notice) => {
        if (selected.size >= BANNER_LIMIT) return;
        if (selected.has(notice.articleId)) return;
        selected.set(
          notice.articleId,
          toBannerNotice(notice, selected.size, "popular"),
        );
      });
  }

  return Array.from(selected.values());
};

export const HeroBannerCarousel = () => {
  const { departmentId = DEFAULT_DEPARTMENT_ID } = useParams();
  const backendDeptCode = getBackendDeptCodeByDepartmentId(departmentId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: deadlineNotices = [], isPending: isDeadlinePending } = useQuery(
    {
      queryKey: ["notices", "hero", "deadline", departmentId, backendDeptCode],
      queryFn: () =>
        fetchNotices({
          deptCode: backendDeptCode,
          sortBy: "deadline",
          limit: BANNER_LIMIT,
        }),
    },
  );

  const { data: recentNotices = [], isPending: isRecentPending } = useQuery({
    queryKey: [
      "notices",
      "hero",
      "popular-fallback",
      departmentId,
      backendDeptCode,
    ],
    queryFn: () =>
      fetchNotices({
        deptCode: backendDeptCode,
        sortBy: "recent",
        limit: 40,
      }),
  });

  const banners = useMemo(
    () => buildBannerNotices(deadlineNotices, recentNotices),
    [deadlineNotices, recentNotices],
  );

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length, isPaused]);

  const isLoading = isDeadlinePending || isRecentPending;

  if (isLoading && banners.length === 0) {
    return (
      <div className="relative mb-10 flex h-[240px] w-full items-end overflow-hidden rounded-2xl bg-slate-900 p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-950" />
        <div className="relative z-10 h-20 w-full max-w-2xl animate-pulse rounded-lg bg-white/10" />
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const activeIndex = currentIndex % banners.length;

  return (
    <div
      className="relative mb-10 flex h-[240px] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 flex flex-col justify-end p-8 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${banner.bgColor} opacity-95`}
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.22),transparent_45%,rgba(15,23,42,0.28))]" />

          <div className="flex flex-col items-start gap-3 text-white">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
              {banner.mode === "deadline" && banner.dDay !== undefined
                ? `마감 임박 (D-${banner.dDay})`
                : "조회수 높은 공지"}
            </span>

            <h2 className="w-full max-w-2xl truncate text-2xl leading-tight font-bold tracking-normal drop-shadow-md sm:text-3xl">
              {banner.title}
            </h2>

            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/90">
              <span className="hidden max-w-md truncate opacity-85 sm:inline-block">
                {banner.description}
              </span>
              <div className="hidden h-3 w-[1px] bg-white/30 sm:block" />
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={14}
                  className="text-white/70"
                />
                <span>{banner.dateLabel}</span>
              </div>
              {banner.mode === "popular" && (
                <div className="flex items-center gap-1.5">
                  <Eye
                    size={14}
                    className="text-white/70"
                  />
                  <span>{banner.views.toLocaleString()}회</span>
                </div>
              )}
            </div>

            <Link
              to={ROUTES.noticeDetail(departmentId, banner.id)}
              className="absolute inset-0 z-20"
              aria-label={`${banner.title} 상세보기`}
            />
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <div className="absolute right-8 bottom-6 z-30 flex gap-2">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
