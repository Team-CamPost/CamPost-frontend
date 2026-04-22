import { Outlet } from "react-router-dom";
import { DepartmentSidebar } from "./components/DepartmentSidebar";
import { Footer } from "./components/Footer";

export const DepartmentLayout = () => {
  return (
    <div className="flex w-full items-start bg-slate-50/30 md:flex-row">
      {/* Sidebar - hidden on mobile, sticky on desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[260px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-6 pt-8 md:flex lg:px-8">
        <DepartmentSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-4rem)] w-full min-w-0 flex-1 flex-col">
        <div className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-8 lg:px-12">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};
