import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import { useAuth } from "../../shared/hooks/useAuth";

export const LoginPage = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const loginTimerRef = useRef<number | null>(null);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirectTo") || ROUTES.home;

  useEffect(() => {
    return () => {
      if (loginTimerRef.current) {
        window.clearTimeout(loginTimerRef.current);
      }
    };
  }, []);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (loginTimerRef.current) {
      window.clearTimeout(loginTimerRef.current);
    }

    setIsSubmitting(true);
    login();
    loginTimerRef.current = window.setTimeout(() => {
      setIsSubmitting(false);
      navigate(redirectTo, { replace: true });
    }, 400);
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="shadow-soft w-full max-w-[400px] rounded-lg border border-slate-200 bg-white p-8">
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold text-[#2046FF]">CamPost</p>
          <h1 className="text-2xl font-bold text-slate-950">로그인</h1>
          <p className="mt-2 text-sm text-slate-500">
            아이디와 비밀번호를 입력해주세요.
          </p>
        </div>

        <form
          className="space-y-4"
          noValidate
          onSubmit={handleLogin}
        >
          <label
            className="block"
            htmlFor="login-id"
          >
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              아이디
            </span>
            <input
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
              id="login-id"
              onChange={(event) => {
                setLoginId(event.target.value);
                setError("");
              }}
              placeholder="아이디 입력"
              type="text"
              value={loginId}
            />
          </label>

          <label
            className="block"
            htmlFor="login-password"
          >
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              비밀번호
            </span>
            <input
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
              id="login-password"
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="비밀번호 입력"
              type="password"
              value={password}
            />
          </label>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2046FF] text-sm font-semibold text-white transition hover:bg-[#1838d8] disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSubmitting}
            type="submit"
          >
            <LogIn
              aria-hidden="true"
              className="h-4 w-4"
            />
            {isSubmitting ? "로그인 중" : "로그인"}
          </button>
        </form>

        <Link
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 transition hover:border-[#2046FF] hover:text-[#2046FF]"
          to={ROUTES.signup}
        >
          <UserPlus
            aria-hidden="true"
            className="h-4 w-4"
          />
          회원가입
        </Link>
      </div>
    </section>
  );
};
