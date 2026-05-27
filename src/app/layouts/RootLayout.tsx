import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { ScrollToTop } from "../router/ScrollToTop";
import { ROUTE_PATHS } from "../router/paths";

export const RootLayout = () => {
  const location = useLocation();
  const shouldHideHeader = location.pathname === ROUTE_PATHS.onboardingProfile;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/30 font-sans text-slate-900">
      <ScrollToTop />
      {!shouldHideHeader && <Header />}
      <main className="relative flex w-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};
