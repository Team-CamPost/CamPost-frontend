export interface NoticeDetailData {
  id: string;
  title: string;
  category: string;
  department: string;
  date: string;
  deadline: string;
  dDay?: number;
  author: string;
  target: string;
  applyMethod: string;
  views: number;
  isBookmarked: boolean;
  bodyText: string;
  originalUrl: string;
  tags: string[];
}

export interface NoticeDetailDto {
  id: number;
  articleId: string;
  title: string;
  department: string | null;
  author: string | null;
  category: string | null;
  date: string | null;
  views: number | null;
  deadline: string | null;
  target: string | null;
  applyMethod: string | null;
  bodyText: string | null;
  sourceUrl: string | null;
  publishedAt: string | null;
  createdAt: string | null;
}
