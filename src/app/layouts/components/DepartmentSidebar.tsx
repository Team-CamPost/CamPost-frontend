import { Link, useParams, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Bookmark,
  GraduationCap,
  AlarmClock,
} from "lucide-react";
import { ROUTES } from "../../router/paths";
import { getDepartmentById } from "../../../shared/constants/departments";

export const DepartmentSidebar = () => {
  const { departmentId = "" } = useParams();
  const location = useLocation();
  const department = getDepartmentById(departmentId);

  // Navigation items
  const NAV_ITEMS = [
    {
      id: "dashboard",
      label: "대시보드 홈",
      icon: <LayoutDashboard size={18} />,
      path: ROUTES.departmentDashboard(departmentId),
    },
    {
      id: "all-notices",
      label: "전체 공지사항",
      icon: <Bell size={18} />,
      path: `${ROUTES.departmentDashboard(departmentId)}#recent`,
    },
    {
      id: "deadline-notices",
      label: "마감 임박 공지",
      icon: <AlarmClock size={18} />,
      path: `${ROUTES.departmentDashboard(departmentId)}#deadline`,
    },
    {
      id: "bookmarks",
      label: "내 북마크",
      icon: <Bookmark size={18} />,
      path: ROUTES.bookmarks,
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Department Header */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#2046FF]/10 to-[#2046FF]/5 text-[#2046FF]">
          <GraduationCap size={20} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold text-slate-900">
            {department?.name || "알 수 없는 학과"}
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-1">
        <span className="mb-2 px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Menu
        </span>
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.path || location.hash === item.path;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#2046FF]/10 text-[#2046FF]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div
                className={`${
                  isActive ? "text-[#2046FF]" : "text-slate-400"
                } transition-colors`}
              >
                {item.icon}
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
