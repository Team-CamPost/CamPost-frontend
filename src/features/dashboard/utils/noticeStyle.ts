import type { NoticeCardData } from "../types/notice";

type NoticeWithDeadline = Pick<NoticeCardData, "dDay">;

export const DEADLINE_SOON_THRESHOLD = 5;

export const isDeadlineSoon = (notice: NoticeWithDeadline) =>
  notice.dDay !== undefined && notice.dDay <= DEADLINE_SOON_THRESHOLD;

export const getCategoryTone = (category: string) => {
  switch (category) {
    case "장학금":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "행사":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "채용":
    case "취업":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "학사":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "일반":
    case "전체":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};
