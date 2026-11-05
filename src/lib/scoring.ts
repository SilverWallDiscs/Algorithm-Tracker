/**
 * Transparent scoring baseline. Every input must be normalized to 0–100 per
 * platform, category and time window before comparison. DEMO values are illustrative.
 */
export interface ScoreInputs {
  velocity: number;
  acceleration: number;
  relativeEngagement: number;
  recency: number;
  crossPlatformSpread: number;
  creatorCompetition: number;
  saturation: number;
}
const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function calculateTrendScore(input: ScoreInputs): number {
  return Math.round(clamp(
    input.velocity * 0.28 + input.acceleration * 0.18 +
    input.relativeEngagement * 0.18 + input.recency * 0.14 +
    input.crossPlatformSpread * 0.12 + (100 - input.saturation) * 0.10
  ));
}

export function calculateOpportunityScore(input: ScoreInputs): number {
  return Math.round(clamp(
    input.velocity * 0.20 + input.acceleration * 0.15 +
    input.relativeEngagement * 0.15 + input.recency * 0.10 +
    input.crossPlatformSpread * 0.10 + (100 - input.creatorCompetition) * 0.15 +
    (100 - input.saturation) * 0.15
  ));
}

export function calculateSaturationScore(input: Pick<ScoreInputs, "creatorCompetition" | "saturation" | "relativeEngagement">): number {
  return Math.round(clamp(input.creatorCompetition * 0.45 + input.saturation * 0.40 + (100 - input.relativeEngagement) * 0.15));
}
