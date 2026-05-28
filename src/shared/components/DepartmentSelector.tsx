import { Link, useLocation, useParams } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { ROUTES } from "../../app/router/paths";
import {
  DEFAULT_DEPARTMENT_ID,
  DEPARTMENTS,
  getDepartmentById,
} from "../constants/departments";
import { setPreferredDepartmentId } from "../hooks/usePreferredDepartment";

type DepartmentSelectorProps = {
  className?: string;
  preserveHash?: boolean;
  variant?: "grid" | "sidebar";
};

export const DepartmentSelector = ({
  className = "",
  preserveHash = false,
  variant = "grid",
}: DepartmentSelectorProps) => {
  const { departmentId = DEFAULT_DEPARTMENT_ID } = useParams();
  const location = useLocation();
  const selectedDepartment =
    getDepartmentById(departmentId) ?? getDepartmentById(DEFAULT_DEPARTMENT_ID);

  const getPath = (nextDepartmentId: string) =>
    `${ROUTES.departmentDashboard(nextDepartmentId)}${
      preserveHash ? location.hash : ""
    }`;

  if (variant === "sidebar") {
    return (
      <div className={className}>
        <span className="mb-2 block px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          Department
        </span>
        <div className="flex flex-col gap-1">
          {DEPARTMENTS.map((department) => {
            const isSelected = department.id === selectedDepartment?.id;

            return (
              <Link
                key={department.id}
                className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-[#2046FF]/10 text-[#2046FF]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => setPreferredDepartmentId(department.id)}
                to={getPath(department.id)}
              >
                <span className="truncate">{department.name}</span>
                {isSelected ? (
                  <Check
                    aria-hidden="true"
                    size={16}
                  />
                ) : (
                  <ChevronRight
                    aria-hidden="true"
                    className="text-slate-300"
                    size={16}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="학과 선택"
      className={`border-b border-slate-200 pb-5 ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            {selectedDepartment?.name ?? "공지사항"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            학과를 선택하면 해당 공지로 바로 이동합니다.
          </p>
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {DEPARTMENTS.map((department) => {
          const isSelected = department.id === selectedDepartment?.id;

          return (
            <Link
              key={department.id}
              className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
                isSelected
                  ? "border-[#2046FF] bg-[#2046FF] text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-[#2046FF]/50 hover:text-[#2046FF]"
              }`}
              onClick={() => setPreferredDepartmentId(department.id)}
              to={getPath(department.id)}
            >
              {isSelected && (
                <Check
                  aria-hidden="true"
                  size={16}
                />
              )}
              {department.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
};
