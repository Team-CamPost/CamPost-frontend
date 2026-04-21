import { API_BASE_URL } from "../../../shared/config/env";
import type { ApiResponse, CrawlJob } from "../model/types";

export const getCrawlJobs = async (limit = 10): Promise<CrawlJob[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/collect/jobs?limit=${limit}`,
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<CrawlJob[]>;

  if (!payload.isSuccess) {
    throw new Error(`${payload.code}: ${payload.message}`);
  }

  return payload.result;
};
