import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import { ChevronRight } from "lucide-react";
import { NoticeDetailContent } from "../../features/noticeDetail/components/NoticeDetailContent";
import { NoticeDetailSidebar } from "../../features/noticeDetail/components/NoticeDetailSidebar";
import { NoticeDetailRecommendations } from "../../features/noticeDetail/components/NoticeDetailRecommendations";
import { MOCK_NOTICE_DETAIL } from "../../features/noticeDetail/mockData";
import { ALL_NOTICES } from "../../features/dashboard/mockData";

export const NoticeDetailPage = () => {
  const { departmentId = "" } = useParams();

  // 실제 연동 시 useEffect와 fetch 로직이 들어갈 자리입니다.
  const notice = MOCK_NOTICE_DETAIL;

  // 추천 공지사항 (기존 목데이터 활용)
  const recommendedNotices = ALL_NOTICES.slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8">
      {/* 상단 Breadcrumb */}
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

      {/* 메인 2단 레이아웃 */}
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <NoticeDetailContent notice={notice} />
        <NoticeDetailSidebar notice={notice} />
      </div>

      {/* 하단: 이런 공지는 어때요? (Recommendations) */}
      <NoticeDetailRecommendations
        departmentId={departmentId}
        recommendedNotices={recommendedNotices}
      />
    </main>
  );
};
