import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../app/router/paths";

// Mock banner data
const BANNERS = [
  {
    id: "b1",
    title: "2026학년도 1학기 국가장학금 2차 신청 안내",
    description:
      "재학생은 원칙적으로 1차 신청만 가능하나, 구제신청을 통해 2차 신청이 가능합니다.",
    dDay: 2,
    date: "2026. 04. 14 (화) 18:00 마감",
    bgColor: "from-[#2046FF] via-[#4064FF] to-purple-600",
    linkId: "u1",
  },
  {
    id: "b2",
    title: "[네이버클라우드] 2026년 상반기 신입 공채",
    description:
      "소프트웨어학과 재학생 대상 오프라인 직무 상담회 및 설명회를 진행합니다.",
    dDay: 5,
    date: "2026. 04. 12 (일) 23:59 마감",
    bgColor: "from-emerald-500 via-teal-500 to-cyan-600",
    linkId: "u2",
  },
  {
    id: "b3",
    title: "제 16회 소프트웨어학과 캡스톤 디자인 경진대회",
    description:
      "올해 최고의 프로젝트를 가리는 캡스톤 디자인 경진대회 참가자를 모집합니다.",
    dDay: 10,
    date: "2026. 04. 20 (월) 18:00 마감",
    bgColor: "from-orange-500 via-rose-500 to-pink-600",
    linkId: "n2",
  },
];

export const HeroBannerCarousel = () => {
  const { departmentId = "" } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
    }, 4000); // Change banner every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mb-10 flex h-[240px] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-lg">
      {/* Banner Slides */}
      {BANNERS.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 flex flex-col justify-end p-8 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex
              ? "z-10 opacity-100"
              : "pointer-events-none z-0 opacity-0"
          }`}
        >
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${banner.bgColor} opacity-90`}
          />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50" />

          <div className="flex flex-col items-start gap-3 text-white">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/20 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"></span>
              마감 임박 (D-{banner.dDay})
            </span>

            <h2 className="w-full max-w-2xl truncate text-2xl leading-tight font-bold tracking-tight drop-shadow-md sm:text-3xl">
              {banner.title}
            </h2>

            <div className="flex items-center gap-4 text-xs font-medium text-white/90">
              <span className="hidden max-w-md truncate opacity-80 sm:inline-block">
                {banner.description}
              </span>
              <div className="hidden h-3 w-[1px] bg-white/30 sm:block"></div>
              <div className="flex items-center gap-1.5">
                <Calendar
                  size={14}
                  className="text-white/70"
                />
                <span>{banner.date}</span>
              </div>
            </div>

            {/* Clickable overlay link for the whole card to make it easy to click */}
            <Link
              to={ROUTES.noticeDetail(departmentId, banner.linkId)}
              className="absolute inset-0 z-20"
              aria-label={`${banner.title} 상세보기`}
            />
          </div>
        </div>
      ))}

      {/* Pagination Indicators */}
      <div className="absolute right-8 bottom-6 z-30 flex gap-2">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
