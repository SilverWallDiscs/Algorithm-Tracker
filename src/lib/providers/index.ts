import type { ProviderStatus, TrendProvider, ProviderMetric } from "./types";

/**
 * Adapters are intentionally unavailable until their official API implementation
 * and permissions have been tested. A key alone is not proof of a working provider.
 */
class UnconfiguredProvider implements TrendProvider {
  constructor(
    public readonly platform: "youtube" | "tiktok" | "x",
    private readonly envKey: string,
    private readonly missingMessage: string
  ) {}

  async getStatus(): Promise<ProviderStatus> {
    const keyDetected = Boolean(process.env[this.envKey]);
    return {
      platform: this.platform,
      connected: false,
      quality: "unavailable",
      checkedAt: new Date().toISOString(),
      message: keyDetected
        ? "Credential detected, but this provider adapter is not implemented or verified yet."
        : this.missingMessage
    };
  }

  async searchTrends(_query: string, _region: string): Promise<ProviderMetric[]> {
    return [];
  }
}

export const trendProviders: Record<"youtube" | "tiktok" | "x", TrendProvider> = {
  youtube: new UnconfiguredProvider("youtube", "YOUTUBE_API_KEY", "YouTube API key not configured."),
  tiktok: new UnconfiguredProvider("tiktok", "TIKTOK_CLIENT_KEY", "No authorized TikTok trend source configured."),
  x: new UnconfiguredProvider("x", "X_BEARER_TOKEN", "X API bearer token not configured.")
};
