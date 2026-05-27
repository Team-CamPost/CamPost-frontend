import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DEFAULT_PUBLIC_ENTRY_PATH, ROUTES } from "../../router/paths";
import logoImage from "../../../assets/images/CamPost_logo.png";
import { useAuth } from "../../../shared/hooks/useAuth";
import { usePreferredDepartment } from "../../../shared/hooks/usePreferredDepartment";

export const Header = () => {
  const navigate = useNavigate();
  const { preferredDepartmentId } = usePreferredDepartment();
  const { isAuthenticated, logout, userName, username } = useAuth();
  const displayName = userName || username || "사용자";

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (preferredDepartmentId) {
      navigate(ROUTES.departmentDashboard(preferredDepartmentId));
      return;
    }

    navigate(DEFAULT_PUBLIC_ENTRY_PATH);
  };

  const handleLogout = () => {
    navigate(DEFAULT_PUBLIC_ENTRY_PATH, { replace: true });
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full items-center justify-between px-6 text-sm lg:px-8">
        <a
          className="flex items-center gap-2 text-xl font-bold tracking-tight transition-opacity"
          href="/"
          onClick={handleLogoClick}
        >
          <img
            alt="CamPost Logo"
            className="h-8 w-auto object-contain"
            src={logoImage}
          />
        </a>

        <div className="flex items-center gap-5 font-medium">
          {isAuthenticated ? (
            <>
              <Link
                className="text-slate-700 transition-colors hover:text-[#2046FF]"
                to={ROUTES.mypage}
              >
                {displayName}님
              </Link>
              <button
                className="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition-all hover:bg-slate-200 active:scale-95"
                onClick={handleLogout}
                type="button"
              >
                로그아웃
              </button>
            </>
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
