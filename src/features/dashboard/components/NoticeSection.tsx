import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { NoticeCardData } from "../types/notice";
import { NoticeCard } from "./NoticeCard";

interface NoticeSectionProps {
  title: string;
  description?: string;
  notices: NoticeCardData[];
  departmentId: string;
  viewAllLink?: string;
  emptyMessage: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const NoticeSection = ({
  title,
  description,
  notices,
  departmentId,
  viewAllLink = "#",
  emptyMessage,
  isLoading = false,
  isError = false,
  errorMessage,
}: NoticeSectionProps) => {
  const sectionId = viewAllLink.startsWith("#")
    ? viewAllLink.slice(1)
    : undefined;
  const hasNotices = notices.length > 0;
  const bodyText = isLoading
    ? "데이터를 불러오는 중입니다..."
    : isError
      ? errorMessage || "데이터를 불러오지 못했습니다."
      : emptyMessage;

  return (
    <section
      id={sectionId}
      className="scroll-mt-24"
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-[#2046FF]"
          >
            더보기 <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {hasNotices ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              departmentId={departmentId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8">
          <p
            className={`text-base ${isError ? "text-rose-600" : "text-slate-500"}`}
          >
            {bodyText}
          </p>
        </div>
      )}
    </section>
  );
};
