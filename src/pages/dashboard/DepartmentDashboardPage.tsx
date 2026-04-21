import { HeroBannerCarousel } from "./components/HeroBannerCarousel";
import { NoticeSection } from "./components/NoticeSection";
import { URGENT_NOTICES, ALL_NOTICES } from "./mockData";

export const DepartmentDashboardPage = () => {
  return (
    <main className="min-h-screen w-full pb-20">
      {/* 1. Hero Banner Carousel (Auto-scrolling) */}
      <HeroBannerCarousel />

      {/* 3. Curated Notice Sections (Event-us Style) */}
      <NoticeSection
        title="적극 홍보 중인 공지"
        description="학과의 중요한 행사나 혜택을 놓치지 마세요! 🔥"
        notices={URGENT_NOTICES}
        viewAllLink="#urgent"
      />

      <NoticeSection
        title="최신 등록 공지"
        description="방금 올라온 따끈따끈한 새 소식입니다."
        notices={ALL_NOTICES.slice(0, 4)} // Show top 4
        viewAllLink="#recent"
      />

      <NoticeSection
        title="마감 임박 공지"
        description="시간이 얼마 남지 않았어요! 서둘러 확인하세요."
        notices={[...URGENT_NOTICES, ...ALL_NOTICES]
          .filter((n) => n.dDay !== undefined)
          .slice(0, 4)}
        viewAllLink="#deadline"
      />
    </main>
  );
};
