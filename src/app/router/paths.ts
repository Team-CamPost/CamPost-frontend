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
