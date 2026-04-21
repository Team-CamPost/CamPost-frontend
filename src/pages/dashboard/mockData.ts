export type NoticeCategory = "전체" | "장학금" | "채용" | "행사" | "학사";

export interface Notice {
  id: string;
  title: string;
  summary?: string;
  category: NoticeCategory;
  date: string;
  dDay?: number;
  isUrgent?: boolean;
  hasAttachment?: boolean;
  isBookmarked?: boolean;
}

export const MOCK_STATS = {
  todayNew: 12,
  urgentDeadline: 5,
  unreadImportant: 3,
};

export const URGENT_NOTICES: Notice[] = [
  {
    id: "u1",
    title: "2026학년도 1학기 국가장학금 2차 신청 안내",
    summary:
      "재학생은 원칙적으로 1차 신청만 가능하나, 구제신청을 통해 2차 신청이 가능합니다. 기한 내 반드시 신청 바랍니다.",
    category: "장학금",
    date: "2026.04.14",
    dDay: 2,
    isUrgent: true,
    hasAttachment: true,
    isBookmarked: false,
  },
  {
    id: "u2",
    title: "[네이버클라우드] 2026년 상반기 신입 공채 캠퍼스 리크루팅",
    summary:
      "소프트웨어학과 재학생 대상 오프라인 직무 상담회 및 설명회를 진행합니다. 사전 신청자 우선 입장.",
    category: "채용",
    date: "2026.04.12",
    dDay: 5,
    isUrgent: true,
    hasAttachment: false,
    isBookmarked: true,
  },
];

export const ALL_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "2026학년도 1학기 수강신청 정정기간 안내",
    category: "학사",
    date: "2026.04.21",
    hasAttachment: false,
  },
  {
    id: "n2",
    title: "제 16회 소프트웨어학과 캡스톤 디자인 경진대회 참가자 모집",
    category: "행사",
    date: "2026.04.20",
    dDay: 10,
    hasAttachment: true,
  },
  {
    id: "n3",
    title: "26학번 신입생 환영회 및 OT 자료 배포",
    category: "행사",
    date: "2026.04.19",
    hasAttachment: true,
  },
  {
    id: "n4",
    title: "2026학년도 하계방학 현장실습(인턴십) 참여학생 모집",
    category: "채용",
    date: "2026.04.18",
    dDay: 14,
    hasAttachment: true,
  },
  {
    id: "n5",
    title: "교내 전공 튜터링 프로그램 튜터/튜티 모집",
    category: "학사",
    date: "2026.04.17",
    hasAttachment: false,
  },
];

export const RECOMMENDED_KEYWORDS = [
  "#캡스톤",
  "#취업",
  "#인턴십",
  "#교환학생",
  "#근로장학생",
];

export const RECOMMENDED_NOTICES: Notice[] = [
  {
    id: "r1",
    title: "2026 카카오 채용 연계형 겨울 인턴십 (SW엔지니어)",
    category: "채용",
    date: "2026.04.20",
  },
  {
    id: "r2",
    title: "SW중심대학사업단 산학협력 프로젝트 지원금 신청",
    category: "학사",
    date: "2026.04.18",
  },
];
