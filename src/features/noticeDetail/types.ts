export interface NoticeDetailData {
  id: string;
  title: string;
  category: string;
  department: string;
  date: string;
  deadline: string;
  deadlineTime?: string;
  deadlineAt?: string;
  dDay?: number;
  author: string;
  target: string;
  applyMethod: string;
  views: number;
  isBookmarked: boolean;
  bodyText: string;
  bodyHtml: string;
  contentHtml: string;
  contentStats: NoticeContentStats | null;
  attachments: NoticeAttachmentData[];
  originalUrl: string;
  tags: string[];
}

export interface NoticeContentStats {
  image_count?: number;
  table_count?: number;
  file_count?: number;
  text_length?: number;
  [key: string]: unknown;
}

export interface NoticeAttachmentData {
  id: number;
  fileKey: string;
  originalName: string;
  ext: string | null;
  fileType: string | null;
  mimeType: string | null;
  fileSize: number | null;
  checksum: string | null;
  sourceUrl: string | null;
  localPath: string | null;
  downloadOk: boolean | null;
  extractedText: string | null;
  extractedChars: number | null;
  parser: string | null;
  parseQuality: string | null;
  parseOk: boolean | null;
  downloadCached: boolean | null;
  previewPdfPath: string | null;
  previewPdfSize: number | null;
  previewPdfChecksum: string | null;
  conversionStatus: string | null;
  conversionEngine: string | null;
  conversionError: string | null;
  createdAt: string | null;
  isPreviewFile?: boolean;
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
  deadlineTime: string | null;
  deadlineAt: string | null;
  target: string | null;
  applyMethod: string | null;
  bodyText: string | null;
  bodyHtml: string | null;
  contentHtml: string | null;
  contentAssets: unknown | null;
  contentStats: NoticeContentStats | null;
  attachments: NoticeAttachmentDto[] | null;
  sourceUrl: string | null;
  publishedAt: string | null;
  createdAt: string | null;
}

export interface NoticeAttachmentDto {
  id: number;
  fileKey: string | null;
  originalName: string | null;
  ext: string | null;
  fileType: string | null;
  mimeType: string | null;
  fileSize: number | null;
  checksum: string | null;
  sourceUrl: string | null;
  localPath: string | null;
  downloadOk: boolean | null;
  extractedText: string | null;
  extractedChars: number | null;
  parser: string | null;
  parseQuality: string | null;
  parseOk: boolean | null;
  downloadCached: boolean | null;
  previewPdfPath: string | null;
  previewPdfSize: number | null;
  previewPdfChecksum: string | null;
  conversionStatus: string | null;
  conversionEngine: string | null;
  conversionError: string | null;
  createdAt: string | null;
}
