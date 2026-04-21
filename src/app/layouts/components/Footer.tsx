export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8">
      <div className="mx-auto flex w-full flex-col items-center justify-between gap-4 px-6 md:flex-row lg:px-8">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="text-sm font-semibold tracking-tight text-slate-700">
            CamPost
          </span>
          <span className="text-xs text-slate-500">
            대학 학과 공지를 더 쉽고 빠르게 확인하세요.
          </span>
        </div>
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} CamPost. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
