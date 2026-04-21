import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import { getDepartmentById } from "../../shared/constants/departments";

export const DepartmentDashboardPage = () => {
  const { departmentId = "" } = useParams();
  const department = getDepartmentById(departmentId);

  return (
    <main className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="mb-2 text-2xl font-bold">학과 대시보드 페이지입니다.</h1>
      <p className="mb-6 text-slate-600">
        현재 학과: {department ? department.name : departmentId}
      </p>

      <div className="space-x-4 text-sm text-[#2046FF]">
        <Link to={ROUTES.noticeDetail(departmentId || "sw", "1")}>
          공지 상세로 이동
        </Link>
        <Link to={ROUTES.bookmarks}>북마크(Private)로 이동</Link>
        <Link to={ROUTES.home}>랜딩으로 이동</Link>
      </div>
    </main>
  );
};
