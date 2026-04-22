import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../../shared/constants/departments";
import { ROUTES } from "../../app/router/paths";
import { setPreferredDepartmentId } from "../../shared/hooks/usePreferredDepartment";
import camPostLogo from "../../assets/images/CamPost_logo.png";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelectDepartment = (departmentId: string) => {
    setPreferredDepartmentId(departmentId);
    navigate(ROUTES.departmentDashboard(departmentId));
  };

  return (
    <main className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#f4f7ff] px-6 py-12 text-slate-900 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-[#2046FF]/12 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-3xl flex-col items-center rounded-3xl border border-white/60 bg-white/80 px-6 py-10 shadow-[0_30px_80px_rgba(32,70,255,0.15)] backdrop-blur-xl sm:px-10 sm:py-12">
        <p className="max-w-2xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
          놓치기 쉬운 공지들 사이에서 정말 중요한 정보만 빠르게
        </p>

        <img
          src={camPostLogo}
          alt="CamPost 로고"
          className="mt-6 h-20 w-auto object-contain opacity-95 drop-shadow-[0_8px_20px_rgba(15,23,42,0.12)] sm:h-24"
        />

        <p className="mt-6 text-center text-sm font-bold tracking-[0.12em] text-[#2046FF] uppercase">
          학과를 선택해주세요.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          {DEPARTMENTS.map((department) => (
            <button
              key={department.id}
              type="button"
              className="group relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-[#2046FF]/40 hover:bg-[#f7f9ff] hover:shadow-[0_14px_30px_rgba(32,70,255,0.16)]"
              onClick={() => handleSelectDepartment(department.id)}
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#2046FF] to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="text-sm font-semibold text-slate-800 sm:text-base">
                {department.name}
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};
