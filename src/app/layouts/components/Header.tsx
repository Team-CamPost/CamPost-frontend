import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../router/paths";
import { usePreferredDepartment } from "../../../shared/hooks/usePreferredDepartment";
import { useAuth } from "../../../shared/hooks/useAuth";
import logoImage from "../../../assets/images/CamPost_logo.png";
import type { MouseEvent } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const { preferredDepartmentId } = usePreferredDepartment();
  const { isAuthenticated, logout } = useAuth();

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (preferredDepartmentId) {
      navigate(ROUTES.departmentDashboard(preferredDepartmentId));
    } else {
      navigate(ROUTES.home);
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full items-center justify-between px-6 text-sm lg:px-8">
        <div className="flex items-center gap-8">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-xl font-bold tracking-tight transition-opacity"
          >
            <img
              src={logoImage}
              alt="CamPost Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <Link
            className="text-slate-600 transition-colors hover:text-[#2046FF]"
            to={ROUTES.mypage}
          >
            마이페이지
          </Link>
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95"
            >
              로그아웃
            </button>
          ) : (
            <Link
              className="rounded-full bg-linear-to-r from-[#2046FF] to-[#4064FF] px-5 py-2 text-white shadow-md shadow-[#2046FF]/20 transition-all hover:shadow-lg hover:shadow-[#2046FF]/30 active:scale-95"
              to={ROUTES.login}
            >
              로그인
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
