export type NoticeSortBy = "recent" | "deadline";

export interface NoticeDto {
  id: number;
  articleId: string;
  title: string;
  department: string | null;
  author: string | null;
  category: string | null;
  date: string | null;
  views: number | null;
  sourceUrl: string | null;
  thumbnailPath: string | null;
  deadline: string | null;
  target: string | null;
  applyMethod: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  isBookmarked: boolean | null;
}

export interface NoticeCardData {
  id: string;
  title: string;
  category: string;
  date: string;
  dDay?: number;
  isBookmarked?: boolean;
  thumbnailUrl?: string;
}
