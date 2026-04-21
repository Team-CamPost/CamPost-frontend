import { Newspaper, Timer, AlertCircle } from "lucide-react";
import { MOCK_STATS } from "../mockData";

export const StatCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Card 1 */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/50 transition-shadow hover:shadow-md">
        <div>
          <h3 className="text-sm font-medium text-slate-500">오늘 신규 공지</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-[#2046FF]">
              {MOCK_STATS.todayNew}
            </span>
            <span className="text-sm font-medium text-slate-600">건</span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2046FF]/10 text-[#2046FF]">
          <Newspaper size={24} />
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/50 transition-shadow hover:shadow-md">
        <div>
          <h3 className="text-sm font-medium text-slate-500">
            마감 임박 (D-3)
          </h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-orange-500">
              {MOCK_STATS.urgentDeadline}
            </span>
            <span className="text-sm font-medium text-slate-600">건</span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
          <Timer size={24} />
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm shadow-slate-200/50 transition-shadow hover:shadow-md">
        <div>
          <h3 className="text-sm font-medium text-slate-500">미확인 중요</h3>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-rose-500">
              {MOCK_STATS.unreadImportant}
            </span>
            <span className="text-sm font-medium text-slate-600">건</span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <AlertCircle size={24} />
        </div>
      </div>
    </div>
  );
};
