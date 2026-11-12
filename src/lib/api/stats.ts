import { apiClient } from './client';

// Backend wraps all responses in this structure
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

export interface PlatformStatistics {
  datasets: number;
  /** The backend now sends `developmentPartners`; `organisations` is the old name. */
  developmentPartners?: number;
  organisations?: number;
  downloads: number;
  users: number;
  lgasCovered: number;
}

/**
 * Get public, real-time platform statistics for the homepage
 */
export async function getPlatformStatistics(): Promise<PlatformStatistics> {
  const response = await apiClient.get<ApiResponse<PlatformStatistics>>('/stats');
  return response.data.data;
}
