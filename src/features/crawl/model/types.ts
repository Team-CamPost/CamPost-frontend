export type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

export type CrawlJob = {
  id: number;
  sourceId: number;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  totalFound: number;
  newCount: number;
  skipCount: number;
  failCount: number;
  errorMsg: string | null;
};
