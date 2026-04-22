import type { NoticeDetailData } from "./types";

export const MOCK_NOTICE_DETAIL: NoticeDetailData = {
  id: "n1",
  title: "DIVE INTO CHANGE: 변화하는 아트페어와 글로벌 미술시장",
  category: "강연/세미나",
  department: "예술",
  date: "2026. 04. 27",
  dDay: 5,
  views: 342,
  isBookmarked: false,
  content: `본문 내용입니다...`,
  originalUrl: "https://example.com/notice/123",
  tags: [
    "#문화체육관광부",
    "#예술경영지원센터",
    "#아트페어",
    "#글로벌미술시장",
  ],
};
