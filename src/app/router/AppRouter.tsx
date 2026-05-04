import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { DepartmentLayout } from "../layouts/DepartmentLayout";
import { BookmarksPage } from "../../pages/bookmarks/BookmarksPage";
import { DepartmentDashboardPage } from "../../pages/dashboard/DepartmentDashboardPage";
import { LandingPage } from "../../pages/landing/LandingPage";
import { LoginPage } from "../../pages/login/LoginPage";
import { MyPage } from "../../pages/mypage/MyPage";
import { NotFoundPage } from "../../pages/notFound/NotFoundPage";
import { NoticeDetailPage } from "../../pages/noticeDetail/NoticeDetailPage";
import { SignupPage } from "../../pages/signup/SignupPage";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { RouteErrorPage } from "./RouteErrorPage";
import { ROUTE_PATHS } from "./paths";

const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.home,
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <LandingPage /> },
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
          { path: ROUTE_PATHS.mypage, element: <MyPage /> },
          { path: ROUTE_PATHS.bookmarks, element: <BookmarksPage /> },
        ],
      },
      { path: ROUTE_PATHS.notFound, element: <NotFoundPage /> },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
