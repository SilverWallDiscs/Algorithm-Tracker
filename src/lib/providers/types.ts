export type ProviderPlatform = "youtube" | "tiktok" | "x";
export type DataQuality = "real" | "estimated" | "demo" | "unavailable";

export interface ProviderStatus {
  platform: ProviderPlatform;
  connected: boolean;
  quality: DataQuality;
  checkedAt: string | null;
  message: string;
}

export interface ProviderMetric {
  platform: ProviderPlatform;
  source: string;
  collectedAt: string;
  quality: Exclude<DataQuality, "unavailable">;
  metric: string;
  value: number;
  normalizedValue?: number;
  region?: string;
  category?: string;
}

export interface TrendProvider {
  readonly platform: ProviderPlatform;
  getStatus(): Promise<ProviderStatus>;
  searchTrends(query: string, region: string): Promise<ProviderMetric[]>;
}
