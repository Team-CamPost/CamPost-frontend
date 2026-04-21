import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";

export const NoticeDetailPage = () => {
  const { departmentId = "", noticeId = "" } = useParams();

  return (
    <main className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="mb-2 text-2xl font-bold">공지 상세 페이지입니다.</h1>
      <p className="mb-6 text-slate-600">
        departmentId: {departmentId}, noticeId: {noticeId}
      </p>

      <div className="space-x-4 text-sm text-[#2046FF]">
        <Link to={ROUTES.departmentDashboard(departmentId || "sw")}>
          대시보드로 이동
        </Link>
        <Link to={ROUTES.bookmarks}>북마크(Private)로 이동</Link>
      </div>
    </main>
  );
};
