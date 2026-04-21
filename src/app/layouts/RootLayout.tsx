import { Link, Outlet } from "react-router-dom";
import { ROUTES } from "../router/paths";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm">
          <div className="flex items-center gap-4">
            <Link
              className="text-primary font-semibold"
              to={ROUTES.home}
            >
              CamPost
            </Link>
            <Link
              className="hover:text-primary text-slate-600"
              to={ROUTES.login}
            >
              로그인
            </Link>
            <Link
              className="hover:text-primary text-slate-600"
              to={ROUTES.mypage}
            >
              마이페이지
            </Link>
          </div>
        </nav>
      </header>

      <Outlet />
    </div>
  );
};
