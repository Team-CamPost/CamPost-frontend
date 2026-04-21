import { Outlet } from "react-router-dom";
import { DepartmentSidebar } from "./components/DepartmentSidebar";

export const DepartmentLayout = () => {
  return (
    <div className="mx-auto flex w-full flex-col items-start gap-8 px-6 pt-0 pb-8 md:flex-row lg:px-8">
      {/* Sidebar - hidden on mobile, sticky on desktop */}
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[260px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 pt-8 pr-8 md:flex">
        <DepartmentSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="w-full min-w-0 flex-1 pt-8">
        <Outlet />
      </div>
    </div>
  );
};
