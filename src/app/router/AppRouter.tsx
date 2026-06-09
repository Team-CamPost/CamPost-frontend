import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { DepartmentLayout } from "../layouts/DepartmentLayout";
import { BookmarksPage } from "../../pages/bookmarks/BookmarksPage";
import { RecentNoticesPage } from "../../pages/recent/RecentNoticesPage";
import { DepartmentDashboardPage } from "../../pages/dashboard/DepartmentDashboardPage";
import { LoginPage } from "../../pages/login/LoginPage";
import { MyPage } from "../../pages/mypage/MyPage";
import { NotFoundPage } from "../../pages/notFound/NotFoundPage";
import { NoticeDetailPage } from "../../pages/noticeDetail/NoticeDetailPage";
import { OnboardingProfilePage } from "../../pages/onboarding/OnboardingProfilePage";
import { SignupPage } from "../../pages/signup/SignupPage";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { RouteErrorPage } from "./RouteErrorPage";
import { DEFAULT_PUBLIC_ENTRY_PATH, ROUTE_PATHS, ROUTES } from "./paths";
import { getPreferredDepartmentId } from "../../shared/hooks/usePreferredDepartment";

// 홈("/") 진입 시 사용자가 설정한 기본 학과로 보내고, 없으면 기본값으로 보낸다.
const HomeRedirect = () => {
  const preferredDepartmentId = getPreferredDepartmentId();
  const target = preferredDepartmentId
    ? ROUTES.departmentDashboard(preferredDepartmentId)
    : DEFAULT_PUBLIC_ENTRY_PATH;
  return (
    <Navigate
      to={target}
      replace
    />
  );
};

const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.home,
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            index: true,
            element: <HomeRedirect />,
          },
          { path: ROUTE_PATHS.login, element: <LoginPage /> },
          { path: ROUTE_PATHS.signup, element: <SignupPage /> },
          {
            element: <DepartmentLayout />,
            children: [
              {
                path: ROUTE_PATHS.departmentDashboard,
                element: <DepartmentDashboardPage />,
              },
              {
                path: ROUTE_PATHS.noticeDetail,
                element: <NoticeDetailPage />,
              },
            ],
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: ROUTE_PATHS.onboardingProfile,
            element: <OnboardingProfilePage />,
          },
          { path: ROUTE_PATHS.mypage, element: <MyPage /> },
          { path: ROUTE_PATHS.bookmarks, element: <BookmarksPage /> },
          { path: ROUTE_PATHS.recent, element: <RecentNoticesPage /> },
        ],
      },
      { path: ROUTE_PATHS.notFound, element: <NotFoundPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
