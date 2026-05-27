import {
  AlertCircle,
  Bell,
  Bookmark,
  ChevronRight,
  Clock3,
  GraduationCap,
  KeyRound,
  LogOut,
  Mail,
  Pencil,
  Search,
  Settings2,
  ShieldCheck,
  X,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import {
  changeMyPassword,
  deleteMyAccount,
  getMyProfile,
  updateMyProfile,
  UserApiError,
  type UserProfileResponse,
} from "../../shared/api/user";
import { DEPARTMENTS } from "../../shared/constants/departments";
import { useAuth } from "../../shared/hooks/useAuth";
import {
  clearOnboardingProfileDraft,
  getOnboardingProfileDraft,
  saveOnboardingProfileDraft,
} from "../../shared/hooks/useOnboardingProfileDraft";
import {
  clearPreferredDepartmentId,
  setPreferredDepartmentId,
} from "../../shared/hooks/usePreferredDepartment";

type MenuItem = {
  title: string;
  description?: string;
  icon: ReactNode;
  to?: string;
  onClick?: () => void;
  danger?: boolean;
  badge?: string;
};

type ProfileEditForm = {
  department: string;
  grade: number | "";
  nickname: string;
};

type CompleteProfileEditForm = Omit<ProfileEditForm, "grade"> & {
  grade: number;
};

type PasswordChangeForm = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

type AccountDeleteForm = {
  currentPassword: string;
};

const departmentNameByCode = new Map(
  DEPARTMENTS.map((department) => [
    department.backendDeptCode,
    department.name,
  ]),
);

const PAGE_MIN_HEIGHT_CLASS = "min-h-[calc(100vh-4rem)]";
const MAX_NICKNAME_LENGTH = 50;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const gradeOptions = [
  { value: 1, label: "1학년" },
  { value: 2, label: "2학년" },
  { value: 3, label: "3학년" },
  { value: 4, label: "4학년" },
  { value: 5, label: "5학년 이상" },
] as const;

const getDepartmentName = (department?: string | null) => {
  if (!department?.trim()) {
    return "학과 미설정";
  }

  return departmentNameByCode.get(department) ?? department;
};

const formatGrade = (grade?: number | null) => {
  if (!grade) {
    return "학년 미설정";
  }

  return grade >= 5 ? "5학년 이상" : `${grade}학년`;
};

const formatAffiliation = ({
  departmentName,
  gradeLabel,
  hasDepartment,
  hasGrade,
}: {
  departmentName: string;
  gradeLabel: string;
  hasDepartment: boolean;
  hasGrade: boolean;
}) => {
  if (!hasDepartment && !hasGrade) {
    return "소속 정보 미설정";
  }

  return `${departmentName} · ${gradeLabel}`;
};

const getDepartmentIdByCode = (departmentCode?: string | null) =>
  DEPARTMENTS.find(
    (department) => department.backendDeptCode === departmentCode,
  )?.id ?? "";

const isProfileEditFormComplete = (
  form: ProfileEditForm,
  trimmedNickname: string,
): form is CompleteProfileEditForm =>
  Boolean(form.department) && form.grade !== "" && Boolean(trimmedNickname);

const initialPasswordChangeForm: PasswordChangeForm = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

const initialAccountDeleteForm: AccountDeleteForm = {
  currentPassword: "",
};

export const MyPage = () => {
  const navigate = useNavigate();
  const { logout, userName, username } = useAuth();
  const profileDraft = useMemo(() => getOnboardingProfileDraft(), []);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<ProfileEditForm>({
    department: "",
    grade: "",
    nickname: "",
  });
  const [editErrorMessage, setEditErrorMessage] = useState("");
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>(
    initialPasswordChangeForm,
  );
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [accountDeleteForm, setAccountDeleteForm] = useState<AccountDeleteForm>(
    initialAccountDeleteForm,
  );
  const [accountDeleteErrorMessage, setAccountDeleteErrorMessage] =
    useState("");
  const [isSavingAccountDelete, setIsSavingAccountDelete] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const myProfile = await getMyProfile();

        if (!isMounted) {
          return;
        }

        setProfile(myProfile);
        setProfileErrorMessage("");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const apiError =
          error instanceof UserApiError
            ? error
            : new UserApiError("내 정보를 불러오지 못했습니다.");

        if (apiError.status === 401) {
          logout();
          navigate(ROUTES.login, { replace: true });
          return;
        }

        setProfileErrorMessage(apiError.message);
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  const nickname =
    profile?.nickname || profileDraft?.nickname || userName || "CamPost 사용자";
  const displayUsername = profile?.username || username || "아이디 정보 없음";
  const email = profile?.email || "이메일 정보 없음";
  const departmentCode = profile?.department ?? profileDraft?.departmentCode;
  const grade = profile?.grade ?? profileDraft?.grade;
  const hasDepartment = Boolean(departmentCode?.trim());
  const hasGrade = Boolean(grade);
  const departmentName = getDepartmentName(departmentCode);
  const gradeLabel = formatGrade(grade);
  const affiliationLabel = formatAffiliation({
    departmentName,
    gradeLabel,
    hasDepartment,
    hasGrade,
  });
  const selectedEditDepartment = DEPARTMENTS.find(
    (department) => department.backendDeptCode === editForm.department,
  );
  const trimmedEditNickname = editForm.nickname.trim();
  const canSubmitProfileEdit =
    isProfileEditFormComplete(editForm, trimmedEditNickname) &&
    !isSavingProfile;
  const canSubmitPasswordChange =
    Boolean(passwordForm.currentPassword.trim()) &&
    Boolean(passwordForm.newPassword.trim()) &&
    Boolean(passwordForm.newPasswordConfirm.trim()) &&
    !isSavingPassword;
  const canSubmitAccountDelete =
    Boolean(accountDeleteForm.currentPassword.trim()) && !isSavingAccountDelete;

  const openProfileEditForm = () => {
    setIsChangingPassword(false);
    setIsDeletingAccount(false);
    setEditForm({
      department: departmentCode || "",
      grade: grade || "",
      nickname,
    });
    setEditErrorMessage("");
    setEditSuccessMessage("");
    setIsEditingProfile(true);
  };

  const openPasswordChangeForm = () => {
    setIsEditingProfile(false);
    setIsDeletingAccount(false);
    setEditSuccessMessage("");
    setPasswordForm(initialPasswordChangeForm);
    setPasswordErrorMessage("");
    setPasswordSuccessMessage("");
    setIsChangingPassword(true);
  };

  const openAccountDeleteForm = () => {
    setIsEditingProfile(false);
    setIsChangingPassword(false);
    setEditSuccessMessage("");
    setPasswordSuccessMessage("");
    setAccountDeleteForm(initialAccountDeleteForm);
    setAccountDeleteErrorMessage("");
    setIsDeletingAccount(true);
  };

  const closeProfileEditForm = () => {
    setIsEditingProfile(false);
    setEditErrorMessage("");
  };

  const closePasswordChangeForm = () => {
    setIsChangingPassword(false);
    setPasswordErrorMessage("");
  };

  const closeAccountDeleteForm = () => {
    setIsDeletingAccount(false);
    setAccountDeleteErrorMessage("");
  };

  const handleProfileEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditErrorMessage("");
    setEditSuccessMessage("");

    if (!isProfileEditFormComplete(editForm, trimmedEditNickname)) {
      setEditErrorMessage("닉네임, 학과, 학년을 모두 입력해주세요.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const updatedProfile = await updateMyProfile({
        department: editForm.department,
        grade: editForm.grade,
        nickname: trimmedEditNickname,
      });

      setProfile(updatedProfile);

      const updatedDepartmentId = getDepartmentIdByCode(
        updatedProfile.department,
      );

      if (
        updatedDepartmentId &&
        updatedProfile.department &&
        updatedProfile.grade != null
      ) {
        setPreferredDepartmentId(updatedDepartmentId);
        saveOnboardingProfileDraft({
          departmentId: updatedDepartmentId,
          departmentCode: updatedProfile.department,
          grade: updatedProfile.grade,
          nickname: updatedProfile.nickname,
        });
      }

      setEditSuccessMessage("프로필 정보가 저장되었습니다.");
      setIsEditingProfile(false);
    } catch (error) {
      const apiError =
        error instanceof UserApiError
          ? error
          : new UserApiError("프로필 정보를 저장하지 못했습니다.");

      if (apiError.status === 401) {
        logout();
        navigate(ROUTES.login, { replace: true });
        return;
      }

      setEditErrorMessage(apiError.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChangeSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setPasswordErrorMessage("");
    setPasswordSuccessMessage("");

    const currentPassword = passwordForm.currentPassword;
    const newPassword = passwordForm.newPassword;
    const newPasswordConfirm = passwordForm.newPasswordConfirm;

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !newPasswordConfirm.trim()
    ) {
      setPasswordErrorMessage(
        "현재 비밀번호와 새 비밀번호를 모두 입력해주세요.",
      );
      return;
    }

    if (!passwordPattern.test(newPassword)) {
      setPasswordErrorMessage(
        "새 비밀번호는 영문과 숫자를 모두 포함해 8자 이상으로 입력해주세요.",
      );
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setPasswordErrorMessage("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordErrorMessage("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }

    setIsSavingPassword(true);

    try {
      await changeMyPassword({
        currentPassword,
        newPassword,
      });

      setPasswordForm(initialPasswordChangeForm);
      setPasswordSuccessMessage("비밀번호가 변경되었습니다.");
      setIsChangingPassword(false);
    } catch (error) {
      const apiError =
        error instanceof UserApiError
          ? error
          : new UserApiError("비밀번호를 변경하지 못했습니다.");

      if (apiError.status === 401 && apiError.code !== "AUTH401_CREDENTIALS") {
        logout();
        navigate(ROUTES.login, { replace: true });
        return;
      }

      if (apiError.code === "AUTH401_CREDENTIALS") {
        setPasswordErrorMessage("비밀번호가 올바르지 않습니다.");
        return;
      }

      setPasswordErrorMessage(apiError.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAccountDeleteSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setAccountDeleteErrorMessage("");

    const currentPassword = accountDeleteForm.currentPassword;

    if (!currentPassword.trim()) {
      setAccountDeleteErrorMessage("현재 비밀번호를 입력해주세요.");
      return;
    }

    setIsSavingAccountDelete(true);

    try {
      await deleteMyAccount({ currentPassword });

      clearOnboardingProfileDraft();
      clearPreferredDepartmentId();
      logout();
      navigate(ROUTES.home, { replace: true });
    } catch (error) {
      const apiError =
        error instanceof UserApiError
          ? error
          : new UserApiError("회원탈퇴를 처리하지 못했습니다.");

      if (apiError.status === 401 && apiError.code !== "AUTH401_CREDENTIALS") {
        logout();
        navigate(ROUTES.login, { replace: true });
        return;
      }

      if (apiError.code === "AUTH401_CREDENTIALS") {
        setAccountDeleteErrorMessage("비밀번호가 올바르지 않습니다.");
        return;
      }

      setAccountDeleteErrorMessage(apiError.message);
    } finally {
      setIsSavingAccountDelete(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <main
      className={`${PAGE_MIN_HEIGHT_CLASS} bg-surface px-5 py-8 text-slate-950 sm:px-8`}
    >
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#2046FF]/10 text-[#2046FF]">
                <UserRound
                  aria-hidden="true"
                  className="h-8 w-8"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-[#2046FF]">내 정보</p>
                <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950">
                  {nickname}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {affiliationLabel}
                </p>
                {isProfileLoading && (
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    내 정보를 불러오는 중입니다.
                  </p>
                )}
              </div>
            </div>

            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              onClick={handleLogout}
              type="button"
            >
              <LogOut
                aria-hidden="true"
                className="h-4 w-4"
              />
              로그아웃
            </button>
          </div>

          <div className="mt-6 grid border-t border-slate-100 pt-5 sm:grid-cols-3 sm:divide-x sm:divide-slate-100">
            <ProfileFact
              icon={<ShieldCheck className="h-4 w-4" />}
              label="아이디"
              value={displayUsername}
            />
            <ProfileFact
              icon={<Mail className="h-4 w-4" />}
              label="이메일"
              value={email}
            />
            <ProfileFact
              icon={<GraduationCap className="h-4 w-4" />}
              label="소속"
              value={affiliationLabel}
            />
          </div>

          {profileErrorMessage && (
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              {profileErrorMessage}
            </div>
          )}

          {editSuccessMessage && (
            <div className="mt-5 rounded-xl bg-[#2046FF]/10 px-4 py-3 text-sm font-bold text-[#2046FF]">
              {editSuccessMessage}
            </div>
          )}

          {passwordSuccessMessage && (
            <div className="mt-5 rounded-xl bg-[#2046FF]/10 px-4 py-3 text-sm font-bold text-[#2046FF]">
              {passwordSuccessMessage}
            </div>
          )}
        </section>

        {isEditingProfile && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  내 정보 수정
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  마이페이지와 공지 개인화에 사용할 정보를 수정합니다.
                </p>
              </div>

              <button
                aria-label="내 정보 수정 닫기"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                onClick={closeProfileEditForm}
                type="button"
              >
                <X
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>
            </div>

            <form
              className="mt-5 space-y-5"
              noValidate
              onSubmit={handleProfileEditSubmit}
            >
              <div>
                <label
                  className="text-sm font-bold text-slate-700"
                  htmlFor="profile-nickname"
                >
                  닉네임
                </label>
                <input
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-[#2046FF] focus:ring-4 focus:ring-[#2046FF]/10"
                  id="profile-nickname"
                  maxLength={MAX_NICKNAME_LENGTH}
                  onChange={(event) => {
                    setEditForm((form) => ({
                      ...form,
                      nickname: event.target.value,
                    }));
                    setEditErrorMessage("");
                  }}
                  placeholder="닉네임을 입력해주세요"
                  type="text"
                  value={editForm.nickname}
                />
                <div className="mt-2 flex justify-end text-xs font-semibold text-slate-400">
                  {editForm.nickname.length}/{MAX_NICKNAME_LENGTH}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-700">학과</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {DEPARTMENTS.map((department) => {
                    const isSelected =
                      department.backendDeptCode === editForm.department;

                    return (
                      <button
                        className={`flex h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-bold transition ${
                          isSelected
                            ? "border-[#2046FF] bg-[#2046FF]/5 text-[#2046FF]"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        key={department.id}
                        onClick={() => {
                          setEditForm((form) => ({
                            ...form,
                            department: department.backendDeptCode,
                          }));
                          setEditErrorMessage("");
                        }}
                        type="button"
                      >
                        {department.name}
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-[#2046FF]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-700">학년</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {gradeOptions.map((option) => {
                    const isSelected = option.value === editForm.grade;

                    return (
                      <button
                        className={`h-11 rounded-xl border px-3 text-sm font-bold transition ${
                          isSelected
                            ? "border-[#2046FF] bg-[#2046FF]/5 text-[#2046FF]"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        key={option.value}
                        onClick={() => {
                          setEditForm((form) => ({
                            ...form,
                            grade: option.value,
                          }));
                          setEditErrorMessage("");
                        }}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                선택 정보:{" "}
                <span className="font-bold text-slate-800">
                  {selectedEditDepartment?.name || "학과 미선택"} ·{" "}
                  {editForm.grade ? formatGrade(editForm.grade) : "학년 미선택"}
                </span>
              </div>

              {editErrorMessage && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  {editErrorMessage}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                  onClick={closeProfileEditForm}
                  type="button"
                >
                  취소
                </button>
                <button
                  className="h-11 rounded-xl bg-[#2046FF] px-5 text-sm font-bold text-white transition hover:bg-[#1838d8] disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={!canSubmitProfileEdit}
                  type="submit"
                >
                  {isSavingProfile ? "저장 중" : "저장"}
                </button>
              </div>
            </form>
          </section>
        )}

        {isChangingPassword && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  비밀번호 변경
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  현재 비밀번호를 확인한 뒤 새 비밀번호로 변경합니다.
                </p>
              </div>

              <button
                aria-label="비밀번호 변경 닫기"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                onClick={closePasswordChangeForm}
                type="button"
              >
                <X
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>
            </div>

            <form
              className="mt-5 space-y-5"
              noValidate
              onSubmit={handlePasswordChangeSubmit}
            >
              <PasswordField
                autoComplete="current-password"
                id="current-password"
                label="현재 비밀번호"
                onChange={(value) => {
                  setPasswordForm((form) => ({
                    ...form,
                    currentPassword: value,
                  }));
                  setPasswordErrorMessage("");
                }}
                placeholder="현재 비밀번호 입력"
                value={passwordForm.currentPassword}
              />

              <PasswordField
                autoComplete="new-password"
                id="new-password"
                label="새 비밀번호"
                onChange={(value) => {
                  setPasswordForm((form) => ({
                    ...form,
                    newPassword: value,
                  }));
                  setPasswordErrorMessage("");
                }}
                placeholder="영문+숫자 포함 8자 이상"
                value={passwordForm.newPassword}
              />

              <PasswordField
                autoComplete="new-password"
                id="new-password-confirm"
                label="새 비밀번호 확인"
                onChange={(value) => {
                  setPasswordForm((form) => ({
                    ...form,
                    newPasswordConfirm: value,
                  }));
                  setPasswordErrorMessage("");
                }}
                placeholder="새 비밀번호 재입력"
                value={passwordForm.newPasswordConfirm}
              />

              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500">
                새 비밀번호는 영문과 숫자를 모두 포함해 8자 이상이어야 합니다.
              </div>

              {passwordErrorMessage && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  {passwordErrorMessage}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                  onClick={closePasswordChangeForm}
                  type="button"
                >
                  취소
                </button>
                <button
                  className="h-11 rounded-xl bg-[#2046FF] px-5 text-sm font-bold text-white transition hover:bg-[#1838d8] disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={!canSubmitPasswordChange}
                  type="submit"
                >
                  {isSavingPassword ? "변경 중" : "변경"}
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="mt-5 space-y-4">
          <MenuSection
            items={[
              {
                title: "내 정보 수정",
                description: "닉네임, 학과, 학년",
                icon: <Pencil className="h-5 w-5" />,
                onClick: openProfileEditForm,
              },
              {
                title: "비밀번호 변경",
                description: "현재 비밀번호 확인 후 변경",
                icon: <KeyRound className="h-5 w-5" />,
                onClick: openPasswordChangeForm,
              },
              {
                title: "이메일 설정",
                description: "인증 상태와 연락 이메일",
                icon: <Mail className="h-5 w-5" />,
                badge: "준비 중",
              },
            ]}
            title="계정"
          />

          <MenuSection
            items={[
              {
                title: "북마크한 공지",
                description: "저장한 공지 모아보기",
                icon: <Bookmark className="h-5 w-5" />,
                to: ROUTES.bookmarks,
              },
              {
                title: "최근 본 공지",
                description: "다시 확인할 공지",
                icon: <Clock3 className="h-5 w-5" />,
                badge: "준비 중",
              },
              {
                title: "기본 학과 설정",
                description: "처음 보여줄 공지 학과",
                icon: <GraduationCap className="h-5 w-5" />,
                badge: "준비 중",
              },
            ]}
            title="공지"
          />

          <MenuSection
            items={[
              {
                title: "관심 키워드",
                description: "장학, 모집, 졸업 등",
                icon: <Search className="h-5 w-5" />,
                badge: "추천",
              },
              {
                title: "마감 알림",
                description: "마감 임박 공지 알림",
                icon: <Bell className="h-5 w-5" />,
                badge: "준비 중",
              },
              {
                title: "공지 카테고리",
                description: "자주 보는 공지 유형",
                icon: <Settings2 className="h-5 w-5" />,
                badge: "준비 중",
              },
            ]}
            title="개인화"
          />

          <MenuSection
            items={[
              {
                title: "회원탈퇴",
                description: "계정과 개인 설정 삭제",
                icon: <Trash2 className="h-5 w-5" />,
                danger: true,
                onClick: openAccountDeleteForm,
              },
            ]}
            title="보안"
          />
        </div>
      </div>

      {isDeletingAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5 py-8 backdrop-blur-sm"
          onClick={closeAccountDeleteForm}
        >
          <section
            aria-labelledby="account-delete-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.28)] sm:p-6"
            onClick={(event) => {
              event.stopPropagation();
            }}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-lg font-bold text-red-600"
                  id="account-delete-title"
                >
                  회원탈퇴
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  탈퇴하면 계정 정보와 개인 설정이 삭제되며 다시 복구할 수
                  없습니다.
                </p>
              </div>

              <button
                aria-label="회원탈퇴 닫기"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
                onClick={closeAccountDeleteForm}
                type="button"
              >
                <X
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>
            </div>

            <form
              className="mt-5 space-y-5"
              noValidate
              onSubmit={handleAccountDeleteSubmit}
            >
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                회원탈퇴를 진행하려면 현재 비밀번호를 입력해주세요.
              </div>

              <PasswordField
                autoComplete="current-password"
                id="account-delete-current-password"
                label="현재 비밀번호"
                onChange={(value) => {
                  setAccountDeleteForm((form) => ({
                    ...form,
                    currentPassword: value,
                  }));
                  setAccountDeleteErrorMessage("");
                }}
                placeholder="현재 비밀번호 입력"
                value={accountDeleteForm.currentPassword}
              />

              {accountDeleteErrorMessage && (
                <div className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  {accountDeleteErrorMessage}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  className="h-11 rounded-xl bg-slate-100 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                  onClick={closeAccountDeleteForm}
                  type="button"
                >
                  취소
                </button>
                <button
                  className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  disabled={!canSubmitAccountDelete}
                  type="submit"
                >
                  {isSavingAccountDelete ? "탈퇴 처리 중" : "회원탈퇴"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
};

const ProfileFact = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="py-3 sm:px-4 sm:py-1">
    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
      {icon}
      {label}
    </div>
    <p className="mt-1 truncate text-sm font-bold text-slate-900">{value}</p>
  </div>
);

const PasswordField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) => (
  <div>
    <label
      className="text-sm font-bold text-slate-700"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      autoComplete={autoComplete}
      className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 transition outline-none placeholder:text-slate-400 focus:border-[#2046FF] focus:ring-4 focus:ring-[#2046FF]/10"
      id={id}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      placeholder={placeholder}
      type="password"
      value={value}
    />
  </div>
);

const MenuSection = ({
  title,
  items,
}: {
  title: string;
  items: MenuItem[];
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5">
    <h2 className="text-lg font-bold text-slate-950">{title}</h2>
    <div className="mt-4 divide-y divide-slate-100">
      {items.map((item) => (
        <MenuRow
          item={item}
          key={item.title}
        />
      ))}
    </div>
  </section>
);

const MenuRow = ({ item }: { item: MenuItem }) => {
  const content = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          item.danger
            ? "bg-red-50 text-red-500"
            : "bg-[#2046FF]/10 text-[#2046FF]"
        }`}
      >
        {item.icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-bold ${
            item.danger ? "text-red-500" : "text-slate-900"
          }`}
        >
          {item.title}
        </span>
        {item.description && (
          <span className="mt-0.5 block text-xs text-slate-500">
            {item.description}
          </span>
        )}
      </span>

      {item.badge && (
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
          {item.badge}
        </span>
      )}

      {(item.to || item.onClick) && (
        <ChevronRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-slate-300"
        />
      )}
    </>
  );

  const rowClassName = "flex w-full items-center gap-3 py-4 text-left sm:px-2";
  const actionClassName = `${rowClassName} transition hover:bg-slate-50`;

  if (item.to) {
    return (
      <Link
        className={actionClassName}
        to={item.to}
      >
        {content}
      </Link>
    );
  }

  if (item.onClick) {
    return (
      <button
        className={actionClassName}
        onClick={item.onClick}
        type="button"
      >
        {content}
      </button>
    );
  }

  return <div className={rowClassName}>{content}</div>;
};
