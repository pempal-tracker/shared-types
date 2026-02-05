/**
 * UI-specific types for PEMPal components
 */

export type MetricTrend = "up" | "down" | "stable";

export interface SleepArchitecture {
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  totalMinutes: number;
  deepGoal: number;
  remGoal: number;
}

export interface EnhancedMetric {
  value: number | string;
  unit?: string;
  baseline: number;
  deviation: number; // raw difference
  deviationPercent: number;
  trend: MetricTrend;
  trendValues: number[]; // last 3-5 days
  status: "normal" | "warning" | "danger";
  riskImpact: number; // percentage point contribution to crash risk (0-100)
  context?: string; // e.g., "Elevated due to high activity yesterday"
  sleepArchitecture?: SleepArchitecture;
}
