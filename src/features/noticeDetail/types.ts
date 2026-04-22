export interface NoticeDetailData {
  id: string;
  title: string;
  category: string;
  department: string;
  date: string;
  dDay?: number;
  views: number;
  isBookmarked: boolean;
  content: string;
  originalUrl: string;
  tags: string[];
}
