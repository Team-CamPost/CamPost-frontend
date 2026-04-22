import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "../../../app/router/paths";
import { NoticeCard } from "../../dashboard/components/NoticeCard";
import type { Notice } from "../../dashboard/mockData";

interface NoticeDetailRecommendationsProps {
  departmentId: string;
  recommendedNotices: Notice[];
}

export const NoticeDetailRecommendations = ({
  departmentId,
  recommendedNotices,
}: NoticeDetailRecommendationsProps) => {
  return (
    <div className="mt-24 border-t border-slate-200 pt-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          이런 공지는 어때요?
        </h2>
        <Link
          to={ROUTES.departmentDashboard(departmentId)}
          className="flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-[#2046FF]"
        >
          더 많은 공지 보기 <ChevronRight size={16} />
        </Link>
      </div>

      {/* 기존 NoticeCard 재사용 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {recommendedNotices.map((recNotice) => (
          <NoticeCard
            key={recNotice.id}
            notice={recNotice}
            departmentId={departmentId}
          />
        ))}
      </div>
    </div>
  );
};
