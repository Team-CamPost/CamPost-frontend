import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import { useAuth } from "../../shared/hooks/useAuth";

function LoginPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || ROUTES.home;

  const handleLogin = () => {
    login();
    navigate(redirectTo, { replace: true });
  };

  return (
    <main className="min-h-screen bg-white p-8 text-slate-900">
      <h1 className="mb-4 text-2xl font-bold">로그인 페이지입니다.</h1>
      <p className="mb-6 text-slate-600">데모용 임시 로그인 버튼입니다.</p>

      <div className="mb-6 flex gap-2">
        <button
          type="button"
          className="rounded border border-[#2046FF] bg-[#2046FF] px-3 py-2 text-white"
          onClick={handleLogin}
        >
          로그인(데모)
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 px-3 py-2 text-slate-800"
          onClick={logout}
        >
          로그아웃
        </button>
      </div>

      <p className="mb-2 text-sm">
        현재 로그인 상태: {isAuthenticated ? "로그인" : "비로그인"}
      </p>
      <Link
        className="text-sm text-[#2046FF]"
        to={ROUTES.home}
      >
        랜딩으로 이동
      </Link>
    </main>
  );
}

export default LoginPage;
