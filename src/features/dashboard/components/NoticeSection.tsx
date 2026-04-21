import { ChevronRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { type Notice } from "../mockData";
import { NoticeCard } from "./NoticeCard";

interface NoticeSectionProps {
  title: string;
  description?: string;
  notices: Notice[];
  viewAllLink?: string;
}

export const NoticeSection = ({
  title,
  description,
  notices,
  viewAllLink = "#",
}: NoticeSectionProps) => {
  const { departmentId = "" } = useParams();
  const sectionId = viewAllLink.startsWith("#")
    ? viewAllLink.slice(1)
    : undefined;

  if (!notices || notices.length === 0) return null;

  return (
    <section
      id={sectionId}
      className="mb-16 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
        <Link
          to={viewAllLink}
          className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-[#2046FF]"
        >
          더보기 <ChevronRight size={16} />
        </Link>
      </div>

      {/* Grid Layout for identical card sizes (Event-us style) */}
      {/* Uses 1 column on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            departmentId={departmentId}
          />
        ))}
      </div>
    </section>
  );
};
