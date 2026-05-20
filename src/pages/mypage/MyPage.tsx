import {
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
  Trash2,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../app/router/paths";
import { DEPARTMENTS } from "../../shared/constants/departments";
import { useAuth } from "../../shared/hooks/useAuth";
import { getOnboardingProfileDraft } from "../../shared/hooks/useOnboardingProfileDraft";

type MenuItem = {
  title: string;
  description?: string;
  icon: ReactNode;
  to?: string;
  danger?: boolean;
  badge?: string;
};

const departmentNameByCode = new Map(
  DEPARTMENTS.map((department) => [
    department.backendDeptCode,
    department.name,
  ]),
);

const formatGrade = (grade?: number) => {
  if (!grade) {
    return "학년 미설정";
  }

  return grade >= 5 ? "5학년 이상" : `${grade}학년`;
};

export const MyPage = () => {
  const navigate = useNavigate();
  const { logout, userName, username } = useAuth();
  const profileDraft = getOnboardingProfileDraft();

  const nickname = profileDraft?.nickname || userName || "CamPost 사용자";
  const displayUsername = username || "아이디 정보 없음";
  const departmentName = profileDraft?.departmentCode
    ? (departmentNameByCode.get(profileDraft.departmentCode) ?? "학과 미설정")
    : "학과 미설정";
  const gradeLabel = formatGrade(profileDraft?.grade);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f5f7fb] px-5 py-8 text-slate-950 sm:px-8">
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
                  {departmentName} · {gradeLabel}
                </p>
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
              icon={<GraduationCap className="h-4 w-4" />}
              label="소속"
              value={departmentName}
            />
            <ProfileFact
              icon={<Clock3 className="h-4 w-4" />}
              label="학년"
              value={gradeLabel}
            />
          </div>
        </section>

        <div className="mt-5 space-y-4">
          <MenuSection
            items={[
              {
                title: "내 정보 수정",
                description: "닉네임, 학과, 학년",
                icon: <Pencil className="h-5 w-5" />,
                badge: "준비 중",
              },
              {
                title: "비밀번호 변경",
                description: "현재 비밀번호 확인 후 변경",
                icon: <KeyRound className="h-5 w-5" />,
                badge: "준비 중",
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
                badge: "준비 중",
              },
            ]}
            title="보안"
          />
        </div>
      </div>
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

      <ChevronRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-slate-300"
      />
    </>
  );

  const className =
    "flex w-full items-center gap-3 py-4 text-left transition hover:bg-slate-50 sm:px-2";

  if (item.to) {
    return (
      <Link
        className={className}
        to={item.to}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={className}
      type="button"
    >
      {content}
    </button>
  );
};
