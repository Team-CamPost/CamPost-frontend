import { useState } from "react";

const RECENTLY_VIEWED_KEY = "campost.recently-viewed-notices";
const MAX_RECENT = 20;

export interface RecentNotice {
  id: string;
  title: string;
  category: string | null;
  date: string | null;
  deadline: string | null;
  thumbnailPath: string | null;
  department: string | null;
  viewedAt: number;
}

const read = (): RecentNotice[] => {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentNotice[]) : [];
  } catch {
    return [];
  }
};

export const getRecentlyViewedNotices = (): RecentNotice[] => read();

export const addRecentlyViewedNotice = (
  notice: Omit<RecentNotice, "viewedAt">,
) => {
  const current = read().filter((item) => item.id !== notice.id);
  const next = [{ ...notice, viewedAt: Date.now() }, ...current].slice(
    0,
    MAX_RECENT,
  );
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
  } catch {
    // 시크릿 모드·저장공간 부족·쿠키 차단 등으로 쓰기 실패 시 무시 (최근 본 공지는 부가 기능)
  }
};

export const clearRecentlyViewedNotices = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch {
    // 저장소 접근 불가 시 무시
  }
};

// 마운트 시점의 스냅샷을 반환한다. (페이지 진입 시 1회 로드)
export const useRecentlyViewedNotices = () => {
  const [recentNotices] = useState<RecentNotice[]>(() => read());
  return recentNotices;
};
