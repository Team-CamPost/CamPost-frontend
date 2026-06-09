import { useCallback, useState, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, X } from "lucide-react";
import { ROUTES } from "../../app/router/paths";
import { LoginRequiredContext } from "../hooks/useLoginRequired";

export const LoginRequiredProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const requireLogin = useCallback(() => setOpen(true), []);

  return (
    <LoginRequiredContext.Provider value={requireLogin}>
      {children}
      <LoginRequiredModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </LoginRequiredContext.Provider>
  );
};

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginRequiredModal = ({ open, onClose }: LoginRequiredModalProps) => {
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

  const goLogin = () => {
    onClose();
    navigate(ROUTES.login);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        aria-labelledby="login-required-title"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.28)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex justify-end">
          <button
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        </div>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2046FF]/10 text-[#2046FF]">
          <LogIn
            aria-hidden="true"
            className="h-7 w-7"
          />
        </div>

        <h2
          className="text-lg font-bold text-slate-900"
          id="login-required-title"
        >
          로그인이 필요한 서비스입니다
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          로그인하면 공지를 북마크하고 마이페이지에서 모아볼 수 있습니다.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <button
            className="h-11 rounded-xl bg-[#2046FF] px-5 text-sm font-bold text-white transition hover:bg-[#1838d8]"
            onClick={goLogin}
            type="button"
          >
            로그인 하기
          </button>
          <button
            className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            닫기
          </button>
        </div>
      </section>
    </div>
  );
};
