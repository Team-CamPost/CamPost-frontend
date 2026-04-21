import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50/30 font-sans text-slate-900">
      <Header />
      <main className="relative w-full flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
