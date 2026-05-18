import { DEFAULT_DEPARTMENT_ID } from "../../shared/constants/departments";

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  mypage: "/mypage",
  bookmarks: "/bookmarks",
  departmentDashboard: (departmentId: string) => `/departments/${departmentId}`,
  noticeDetail: (departmentId: string, noticeId: string) =>
    `/departments/${departmentId}/notices/${noticeId}`,
} as const;

export const ROUTE_PATHS = {
  home: "/",
  login: "/login",
  signup: "/signup",
  mypage: "/mypage",
  bookmarks: "/bookmarks",
  departmentDashboard: "/departments/:departmentId",
  noticeDetail: "/departments/:departmentId/notices/:noticeId",
  notFound: "*",
} as const;

// Temporary entry point until the college-wide notices page is ready.
export const DEFAULT_PUBLIC_ENTRY_PATH = ROUTES.departmentDashboard(
  DEFAULT_DEPARTMENT_ID,
);
