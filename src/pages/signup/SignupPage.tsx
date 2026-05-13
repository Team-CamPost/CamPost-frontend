import { useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2, UserPlus } from "lucide-react";
import { ROUTES } from "../../app/router/paths";
import {
  checkEmailVerificationCode,
  checkUsernameAvailability,
  sendEmailVerificationCode,
  signup,
} from "../../shared/api/auth";

type SignupForm = {
  username: string;
  email: string;
  emailCode: string;
  password: string;
  passwordConfirm: string;
};

type SignupErrors = Partial<Record<keyof SignupForm, string>>;

const initialForm: SignupForm = {
  username: "",
  email: "",
  emailCode: "",
  password: "",
  passwordConfirm: "",
};

const requiredMessages: Record<keyof SignupForm, string> = {
  username: "아이디를 입력해주세요.",
  email: "이메일을 입력해주세요.",
  emailCode: "이메일 인증번호를 입력해주세요.",
  password: "비밀번호를 입력해주세요.",
  passwordConfirm: "비밀번호 확인을 입력해주세요.",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
const emailCodePattern = /^\d{6}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const validateField = (
  field: keyof SignupForm,
  form: SignupForm,
  options: { required?: boolean } = {},
) => {
  const { required = true } = options;
  const value = form[field];

  if (!value.trim()) {
    return required ? requiredMessages[field] : "";
  }

  if (field === "username" && !usernamePattern.test(form.username.trim())) {
    return "아이디는 영문과 숫자를 모두 포함한 6~20자로 입력해주세요.";
  }

  if (field === "email" && !emailPattern.test(form.email.trim())) {
    return "올바른 이메일 형식으로 입력해주세요.";
  }

  if (field === "emailCode" && !emailCodePattern.test(form.emailCode.trim())) {
    return "인증번호 6자리를 입력해주세요.";
  }

  if (field === "password" && !passwordPattern.test(form.password)) {
    return "비밀번호는 영문과 숫자를 모두 포함해 8자 이상으로 입력해주세요.";
  }

  if (
    field === "passwordConfirm" &&
    form.password &&
    form.password !== form.passwordConfirm
  ) {
    return "비밀번호가 일치하지 않습니다.";
  }

  return "";
};

const validateSubmitErrors = (form: SignupForm) => {
  const nextErrors: SignupErrors = {};

  Object.keys(form).forEach((field) => {
    const typedField = field as keyof SignupForm;
    const fieldError = validateField(typedField, form, {
      required:
        typedField !== "passwordConfirm" || Boolean(form.password.trim()),
    });

    if (fieldError) {
      nextErrors[typedField] = fieldError;
    }
  });

  return nextErrors;
};

export const SignupPage = () => {
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [usernameCheckMessage, setUsernameCheckMessage] = useState("");
  const [emailAuthMessage, setEmailAuthMessage] = useState("");
  const [emailCodeCheckMessage, setEmailCodeCheckMessage] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkedUsername, setCheckedUsername] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSendingEmailCode, setIsSendingEmailCode] = useState(false);
  const [isCheckingEmailCode, setIsCheckingEmailCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const normalizedUsername = form.username.trim();
  const normalizedEmail = form.email.trim().toLowerCase();
  const isUsernameChecked = checkedUsername === normalizedUsername;
  const isEmailVerified = verifiedEmail === normalizedEmail;

  const handleChange =
    (field: keyof SignupForm) => (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;

      setForm((prevForm) => ({ ...prevForm, [field]: nextValue }));
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
      setSubmitMessage("");
      setIsSubmitted(false);

      if (field === "username") {
        setCheckedUsername("");
        setUsernameCheckMessage("");
      }

      if (field === "email") {
        setVerifiedEmail("");
        setEmailAuthMessage("");
        setEmailCodeCheckMessage("");
      }

      if (field === "emailCode") {
        setVerifiedEmail("");
        setEmailCodeCheckMessage("");
      }
    };

  const handleBlur =
    (field: keyof SignupForm) => (event: FocusEvent<HTMLInputElement>) => {
      const nextForm = { ...form, [field]: event.target.value };
      const fieldError = validateField(field, nextForm, { required: false });

      setErrors((prevErrors) => ({ ...prevErrors, [field]: fieldError }));
    };

  const handleUsernameCheck = async () => {
    const fieldError = validateField("username", form);

    setErrors((prevErrors) => ({ ...prevErrors, username: fieldError }));
    setUsernameCheckMessage("");

    if (fieldError) {
      return;
    }

    setIsCheckingUsername(true);

    try {
      const result = await checkUsernameAvailability(normalizedUsername);

      if (!result.available) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "이미 사용 중인 아이디입니다.",
        }));
        return;
      }

      setCheckedUsername(normalizedUsername);
      setUsernameCheckMessage("사용 가능한 아이디입니다.");
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: getAuthErrorMessage(
          error,
          "아이디 중복 확인에 실패했습니다.",
        ),
      }));
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleEmailAuth = async () => {
    const fieldError = validateField("email", form);

    setErrors((prevErrors) => ({ ...prevErrors, email: fieldError }));
    setEmailAuthMessage("");
    setEmailCodeCheckMessage("");
    setVerifiedEmail("");

    if (fieldError) {
      return;
    }

    setIsSendingEmailCode(true);

    try {
      await sendEmailVerificationCode(normalizedEmail);
      setEmailAuthMessage("인증번호를 전송했습니다.");
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: getAuthErrorMessage(
          error,
          "이메일 인증번호 전송에 실패했습니다.",
        ),
      }));
    } finally {
      setIsSendingEmailCode(false);
    }
  };

  const handleEmailCodeCheck = async () => {
    const emailError = validateField("email", form);
    const codeError = validateField("emailCode", form);

    setErrors((prevErrors) => ({
      ...prevErrors,
      email: emailError,
      emailCode: codeError,
    }));
    setEmailCodeCheckMessage("");

    if (emailError || codeError) {
      return;
    }

    setIsCheckingEmailCode(true);

    try {
      const result = await checkEmailVerificationCode(
        normalizedEmail,
        form.emailCode.trim(),
      );

      if (!result.verified) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailCode: "이메일 인증번호가 유효하지 않습니다.",
        }));
        return;
      }

      setVerifiedEmail(normalizedEmail);
      setEmailCodeCheckMessage("인증번호가 확인되었습니다.");
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailCode: getAuthErrorMessage(
          error,
          "이메일 인증번호 확인에 실패했습니다.",
        ),
      }));
    } finally {
      setIsCheckingEmailCode(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateSubmitErrors(form);

    if (!isUsernameChecked) {
      validationErrors.username = "아이디 중복확인을 완료해주세요.";
    }

    if (!isEmailVerified) {
      validationErrors.emailCode = "이메일 인증을 완료해주세요.";
    }

    setErrors(validationErrors);
    setSubmitMessage("");
    setIsSubmitted(false);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({
        username: normalizedUsername,
        email: normalizedEmail,
        password: form.password,
      });
      setIsSubmitted(true);
      setSubmitMessage(
        "회원가입이 완료되었습니다. 로그인 페이지로 이동해 주세요.",
      );
    } catch (error) {
      setSubmitMessage(
        getAuthErrorMessage(error, "회원가입 처리에 실패했습니다."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAnyRequestPending =
    isCheckingUsername ||
    isSendingEmailCode ||
    isCheckingEmailCode ||
    isSubmitting;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="shadow-soft w-full max-w-[440px] rounded-lg border border-slate-200 bg-white p-8">
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold text-[#2046FF]">CamPost</p>
          <h1 className="text-2xl font-bold text-slate-950">회원가입</h1>
          <p className="mt-2 text-sm text-slate-500">
            계정 정보를 입력하고 CamPost를 시작하세요.
          </p>
        </div>

        <form
          className="space-y-4"
          noValidate
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="signup-username"
            >
              아이디
            </label>
            <div className="flex gap-2">
              <input
                className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
                id="signup-username"
                name="username"
                onBlur={handleBlur("username")}
                onChange={handleChange("username")}
                placeholder="campost123"
                type="text"
                value={form.username}
              />
              <button
                className="h-11 shrink-0 rounded-md border border-[#2046FF] px-3 text-sm font-semibold text-[#2046FF] transition hover:bg-[#2046FF] hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-white"
                disabled={isAnyRequestPending}
                onClick={handleUsernameCheck}
                type="button"
              >
                {isCheckingUsername ? "확인 중" : "중복확인"}
              </button>
            </div>
            {errors.username && (
              <span className="mt-1.5 block text-xs font-medium text-red-500">
                {errors.username}
              </span>
            )}
            {usernameCheckMessage && !errors.username && (
              <span className="mt-1.5 block text-xs font-medium text-emerald-600">
                {usernameCheckMessage}
              </span>
            )}
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="signup-email"
            >
              이메일
            </label>
            <div className="flex gap-2">
              <input
                className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
                id="signup-email"
                name="email"
                onBlur={handleBlur("email")}
                onChange={handleChange("email")}
                placeholder="campost@example.com"
                type="email"
                value={form.email}
              />
              <button
                className="h-11 shrink-0 rounded-md border border-[#2046FF] px-4 text-sm font-semibold text-[#2046FF] transition hover:bg-[#2046FF] hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-white"
                disabled={isAnyRequestPending}
                onClick={handleEmailAuth}
                type="button"
              >
                {isSendingEmailCode ? "전송 중" : "인증"}
              </button>
            </div>
            {errors.email && (
              <span className="mt-1.5 block text-xs font-medium text-red-500">
                {errors.email}
              </span>
            )}
            {emailAuthMessage && !errors.email && (
              <span className="mt-1.5 block text-xs font-medium text-emerald-600">
                {emailAuthMessage}
              </span>
            )}
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-slate-700"
              htmlFor="signup-email-code"
            >
              이메일 인증번호
            </label>
            <div className="flex gap-2">
              <input
                className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
                id="signup-email-code"
                inputMode="numeric"
                name="emailCode"
                onBlur={handleBlur("emailCode")}
                onChange={handleChange("emailCode")}
                placeholder="인증번호 6자리"
                type="text"
                value={form.emailCode}
              />
              <button
                className="h-11 shrink-0 rounded-md border border-[#2046FF] px-4 text-sm font-semibold text-[#2046FF] transition hover:bg-[#2046FF] hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-white"
                disabled={isAnyRequestPending}
                onClick={handleEmailCodeCheck}
                type="button"
              >
                {isCheckingEmailCode ? "확인 중" : "확인"}
              </button>
            </div>
            {errors.emailCode && (
              <span className="mt-1.5 block text-xs font-medium text-red-500">
                {errors.emailCode}
              </span>
            )}
            {emailCodeCheckMessage && !errors.emailCode && (
              <span className="mt-1.5 block text-xs font-medium text-emerald-600">
                {emailCodeCheckMessage}
              </span>
            )}
          </div>

          <label
            className="block"
            htmlFor="signup-password"
          >
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              비밀번호
            </span>
            <input
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
              id="signup-password"
              name="password"
              onBlur={handleBlur("password")}
              onChange={handleChange("password")}
              placeholder="영문+숫자 포함 8자 이상"
              type="password"
              value={form.password}
            />
            {errors.password && (
              <span className="mt-1.5 block text-xs font-medium text-red-500">
                {errors.password}
              </span>
            )}
          </label>

          <label
            className="block"
            htmlFor="signup-password-confirm"
          >
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              비밀번호 확인
            </span>
            <input
              className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm transition outline-none focus:border-[#2046FF] focus:ring-2 focus:ring-[#2046FF]/15"
              id="signup-password-confirm"
              name="passwordConfirm"
              onBlur={handleBlur("passwordConfirm")}
              onChange={handleChange("passwordConfirm")}
              placeholder="비밀번호 재입력"
              type="password"
              value={form.passwordConfirm}
            />
            {errors.passwordConfirm && (
              <span className="mt-1.5 block text-xs font-medium text-red-500">
                {errors.passwordConfirm}
              </span>
            )}
          </label>

          <button
            className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#2046FF] text-sm font-semibold text-white transition hover:bg-[#1838d8] disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isAnyRequestPending}
            type="submit"
          >
            {isSubmitting ? (
              <Loader2
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
            ) : (
              <UserPlus
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
            {isSubmitting ? "가입 처리 중" : "회원가입"}
          </button>
        </form>

        {submitMessage && (
          <div
            className={`mt-5 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
              isSubmitted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isSubmitted && (
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
            {submitMessage}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <Link
            className="font-semibold text-[#2046FF] hover:underline"
            to={ROUTES.login}
          >
            로그인
          </Link>
        </p>
      </div>
    </section>
  );
};
