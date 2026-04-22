import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/30 font-sans text-slate-900">
      <Header />
      <main className="relative flex w-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
};
