import { HeroBannerCarousel } from "../../features/dashboard/components/HeroBannerCarousel";
import { TrendingNotices } from "../../features/dashboard/components/TrendingNotices";
import { UrgentNotices } from "../../features/dashboard/components/UrgentNotices";

export const DepartmentDashboardPage = () => {
  return (
    <main className="w-full pb-20">
      <HeroBannerCarousel />
      <UrgentNotices />
      <TrendingNotices />
    </main>
  );
};
