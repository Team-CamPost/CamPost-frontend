import { useLocation } from "react-router-dom";
import { HeroBannerCarousel } from "../../features/dashboard/components/HeroBannerCarousel";
import { LatestNoticeBoard } from "../../features/dashboard/components/LatestNoticeBoard";
import { URGENT_NOTICES, ALL_NOTICES } from "../../features/dashboard/mockData";

export const DepartmentDashboardPage = () => {
  const location = useLocation();
  const activeFilter = location.hash === "#deadline" ? "deadline" : "recent";
  const showHeroBanner = location.hash === "";

  return (
    <main className="w-full pb-20">
      {showHeroBanner && <HeroBannerCarousel />}

      <div
        id="recent"
        className="scroll-mt-24"
      />
      <div
        id="deadline"
        className="scroll-mt-24"
      />

      <LatestNoticeBoard
        notices={[...URGENT_NOTICES, ...ALL_NOTICES]}
        filter={activeFilter}
      />
    </main>
  );
};
