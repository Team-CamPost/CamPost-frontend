import { Link, useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../../shared/constants/departments";
import { ROUTES } from "../../app/router/paths";
import { setPreferredDepartmentId } from "../../shared/hooks/usePreferredDepartment";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelectDepartment = (departmentId: string) => {
    setPreferredDepartmentId(departmentId);
    navigate(ROUTES.departmentDashboard(departmentId));
  };

  return (
    <main className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="mb-4 text-2xl font-bold">CamPost 랜딩 페이지입니다.</h1>
      <p className="mb-4 text-slate-600">
        학과를 선택하면 해당 대시보드로 이동합니다.
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {DEPARTMENTS.map((department) => (
          <button
            key={department.id}
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-slate-800 hover:border-[#2046FF]"
            onClick={() => handleSelectDepartment(department.id)}
          >
            {department.name}
          </button>
        ))}
      </div>

      <div className="space-x-4 text-sm text-[#2046FF]">
        <Link to={ROUTES.login}>로그인으로 이동</Link>
        <Link to={ROUTES.mypage}>마이페이지(Private)로 이동</Link>
      </div>
    </main>
  );
};
