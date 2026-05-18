import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Check, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import {
  DEPARTMENTS,
  DEFAULT_DEPARTMENT_ID,
} from "../../shared/constants/departments";
import { saveOnboardingProfileDraft } from "../../shared/hooks/useOnboardingProfileDraft";
import { setPreferredDepartmentId } from "../../shared/hooks/usePreferredDepartment";

const gradeOptions = [
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
  { value: 3, label: "3학년" },
  { value: 4, label: "4학년" },
  { value: 5, label: "5학년 이상" },
] as const;

const steps = ["학과", "학년", "닉네임"] as const;

export const OnboardingProfilePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [grade, setGrade] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  const [nicknameTouched, setNicknameTouched] = useState(false);

  const trimmedNickname = nickname.trim();
  const nicknameError =
    nicknameTouched && !trimmedNickname ? "닉네임을 입력해주세요." : "";

  const canGoNext = useMemo(() => {
    if (currentStep === 0) {
      return Boolean(departmentId);
    }

    if (currentStep === 1) {
      return grade !== null;
    }

    return Boolean(trimmedNickname);
  }, [currentStep, departmentId, grade, trimmedNickname]);

  const selectedDepartment =
    DEPARTMENTS.find((department) => department.id === departmentId) ??
    DEPARTMENTS.find((department) => department.id === DEFAULT_DEPARTMENT_ID);

  const handleNext = () => {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNicknameTouched(true);

    if (
      !departmentId ||
      grade === null ||
      !trimmedNickname ||
      !selectedDepartment
    ) {
      return;
    }

    setPreferredDepartmentId(departmentId);
    saveOnboardingProfileDraft({
      departmentId,
      departmentCode: selectedDepartment.backendDeptCode,
      grade,
      nickname: trimmedNickname,
    });
    navigate(ROUTES.departmentDashboard(departmentId), { replace: true });
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#f5f7fb] px-5 py-8 text-slate-950 sm:px-8 sm:py-12">
      <form
        className="mx-auto flex min-h-[680px] w-full max-w-[520px] flex-col rounded-[28px] bg-white px-6 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:px-8"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <button
            aria-label="이전 단계"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 disabled:cursor-default disabled:text-slate-300 disabled:hover:bg-transparent"
            disabled={currentStep === 0}
            onClick={() => {
              setCurrentStep((step) => Math.max(0, step - 1));
            }}
            type="button"
          >
            <ChevronLeft
              aria-hidden="true"
              className="h-5 w-5"
            />
          </button>

          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <span
                aria-label={`${step} 단계`}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-7 bg-[#2046FF]"
                    : index < currentStep
                      ? "w-2 bg-[#2046FF]/50"
                      : "w-2 bg-slate-200"
                }`}
                key={step}
              />
            ))}
          </div>

          <span className="w-10 text-right text-sm font-semibold text-slate-400">
            {currentStep + 1}/{steps.length}
          </span>
        </div>

        <div className="mt-10">
          <p className="text-sm font-bold text-[#2046FF]">CamPost</p>
          <h1 className="mt-3 text-[28px] leading-tight font-bold tracking-normal text-slate-950 sm:text-[32px]">
            {currentStep === 0 && "어느 학과 공지를 먼저 볼까요?"}
            {currentStep === 1 && "현재 학년을 선택해주세요"}
            {currentStep === 2 && "사용할 닉네임을 알려주세요"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {currentStep === 0 &&
              "선택한 학과를 기준으로 공지와 마감 정보를 보여드릴게요."}
            {currentStep === 1 &&
              "학년에 맞는 공지 필터와 개인화 기능에 활용돼요."}
            {currentStep === 2 &&
              "마이페이지와 개인 설정 화면에서 표시될 이름이에요."}
          </p>
        </div>

        <div className="mt-10 flex-1">
          {currentStep === 0 && (
            <div className="space-y-3">
              {DEPARTMENTS.map((department) => {
                const isSelected = department.id === departmentId;

                return (
                  <button
                    className={`flex h-14 w-full items-center justify-between rounded-2xl border px-5 text-left text-base font-semibold transition ${
                      isSelected
                        ? "border-[#2046FF] bg-[#f4f7ff] text-[#2046FF]"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    key={department.id}
                    onClick={() => {
                      setDepartmentId(department.id);
                    }}
                    type="button"
                  >
                    <span>{department.name}</span>
                    <SelectionMark selected={isSelected} />
                  </button>
                );
              })}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3">
              {gradeOptions.map((option) => {
                const isSelected = option.value === grade;

                return (
                  <button
                    className={`flex h-14 w-full items-center justify-between rounded-2xl border px-5 text-left text-base font-semibold transition ${
                      isSelected
                        ? "border-[#2046FF] bg-[#f4f7ff] text-[#2046FF]"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                    key={option.value}
                    onClick={() => {
                      setGrade(option.value);
                    }}
                    type="button"
                  >
                    <span>{option.label}</span>
                    <SelectionMark selected={isSelected} />
                  </button>
                );
              })}
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <label
                className="block"
                htmlFor="onboarding-nickname"
              >
                <span className="sr-only">닉네임</span>
                <input
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-base font-semibold text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-[#2046FF] focus:ring-4 focus:ring-[#2046FF]/10"
                  id="onboarding-nickname"
                  maxLength={50}
                  onBlur={() => {
                    setNicknameTouched(true);
                  }}
                  onChange={(event) => {
                    setNickname(event.target.value);
                  }}
                  placeholder="닉네임 입력"
                  type="text"
                  value={nickname}
                />
              </label>

              <div className="mt-3 flex items-center justify-between text-sm">
                <p className="font-medium text-red-500">{nicknameError}</p>
                <span className="text-slate-400">{nickname.length}/50</span>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  선택한 정보
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">학과</dt>
                    <dd className="font-semibold text-slate-900">
                      {selectedDepartment?.name}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">학년</dt>
                    <dd className="font-semibold text-slate-900">
                      {
                        gradeOptions.find((option) => option.value === grade)
                          ?.label
                      }
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>

        <button
          className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2046FF] text-base font-bold text-white transition hover:bg-[#1838d8] disabled:cursor-not-allowed disabled:bg-slate-300"
          disabled={!canGoNext}
          onClick={currentStep < steps.length - 1 ? handleNext : undefined}
          type={currentStep < steps.length - 1 ? "button" : "submit"}
        >
          {currentStep < steps.length - 1 ? "다음" : "완료"}
        </button>
      </form>
    </section>
  );
};

const SelectionMark = ({ selected }: { selected: boolean }) => (
  <span
    className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
      selected ? "border-[#2046FF] bg-[#2046FF]" : "border-slate-300 bg-white"
    }`}
  >
    <Check
      aria-hidden="true"
      className={`h-4 w-4 ${selected ? "text-white" : "text-transparent"}`}
    />
  </span>
);
