// Core health data types

export interface HealthSnapshot {
  id: string;
  timestamp: Date;
  heartRate: number;
  hrv: number; // RMSSD in ms
  skinTemperature: number; // Celsius
  steps: number;
  sleepScore: number;
  recoveryIndex: number;
  movementIndex: number;
  source: "ultrahuman" | "manual";
}

export interface DailyMetrics {
  date: string; // YYYY-MM-DD
  avgHeartRate: number;
  avgHrv: number;
  minHrv: number;
  maxHrv: number;
  avgTemperature: number;
  totalSteps: number;
  sleepScore: number;
  recoveryIndex: number;
  sleepDuration: number; // minutes
  deepSleep: number; // minutes
  remSleep: number; // minutes
  lightSleep: number; // minutes
}

export interface PEMPrediction {
  timestamp: Date;
  riskScore: number; // 0-100
  riskLevel: "low" | "medium" | "high" | "critical";
  confidence: number; // 0-1
  confidenceInterval: number; // ± percentage points
  typicalRisk: number; // historical average risk for the user
  forecastDate: string; // human readable target window
  factors: PEMFactor[];
  recommendation: string;
  preventativeAdvice: string[]; // tactical pacing items
  energyCapacityPercent?: number; // 0-100, derived from riskScore
  activityBudgetMinutes?: number; // safe activity minutes for today
  scenarioRisks?: {
    rest: number; // crash risk if user rests (0-100)
    normal: number; // crash risk at normal activity (0-100)
    active: number; // crash risk at elevated activity (0-100)
  };
  morningLightGuidance?: {
    recommendLight: boolean;
    minutesNeeded: number;
    optimalWindow: string; // e.g., "8-9 AM"
    benefit: string;
  };
}

export interface PEMFactor {
  name: string;
  contribution: number; // 0-1 how much this factor contributes
  value: number;
  threshold: number;
  status: "normal" | "elevated" | "critical";
  direction?: "impact" | "protection";
  description?: string;
}

export interface TiredButWiredAlert {
  timestamp: Date;
  isActive: boolean;
  eveningHrDeviation: number; // % above baseline
  thermalFailure: boolean;
  hrvSuppression: number; // % below 7-day avg
  hrvDayToNightRatio: number | null; // HRV morning/evening ratio (<0.8 = tired-but-wired)
  autonomicStressIndex: number | null; // 0-3+ scale (>1.5 = crisis)
  severity: "mild" | "moderate" | "severe";
}

export interface ACWRMetrics {
  date: string;
  acuteLoad: number; // 7-day
  chronicLoad: number; // 28-day
  ratio: number;
  riskZone: "optimal" | "caution" | "danger";
}

export interface PEMLabel {
  id: string;
  date: string;
  label: "good" | "warning" | "crash";
  severity: number;
  notes: string;
  tags?: string[];
}

export interface SymptomCorrelation {
  symptom: string;
  physiologicalDriver: string;
  correlationCoefficient: number;
  confidence: number;
  frequency: number;
}

export interface UltrahumanAPIResponse {
  success: boolean;
  data?: {
    heart_rate?: { timestamp: string; value: number }[];
    hrv?: { timestamp: string; rmssd: number; sdnn: number }[];
    sleep?: {
      date: string;
      score: number;
      duration: number;
      deep_sleep: number;
      rem_sleep: number;
      light_sleep: number;
    };
    temperature?: { timestamp: string; value: number }[];
    steps?: { timestamp: string; count: number }[];
    recovery?: { date: string; index: number };
    movement?: { date: string; index: number };
  };
  error?: string;
}

export interface ModelTrainingData {
  features: number[][];
  labels: number[];
  featureNames: string[];
}

export interface MLModelState {
  isLoaded: boolean;
  isTraining: boolean;
  lastTrainedAt: Date | null;
  accuracy: number;
  totalSamples: number;
}

// Enhanced Dashboard Types
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

export type ActivityType = "Physical (Light)" | "Physical (Moderate)" | "Cognitive (Deep Work)" | "Social (High Energy)" | "Social (Low Energy)";
export type DiscoveryCategory = "temporal" | "activity" | "physiological" | "compound";

export interface SimulatedOutcome {
  riskIncrease: number; // +% risk score
  recoveryHours: number; // Estimated hours to return to baseline
  warnings: string[];
}

export interface DiscoveredPattern {
  id: string;
  category: DiscoveryCategory;
  title: string;
  description: string;
  insight: string;
  confidence: number; // 0-1
  significance: number; // p-value
  lastObserved?: string;
}

export interface TemporalStatus {
  date: string | number; // Support both ISO strings and Unix timestamps (ms)
  riskScore: number;
  status: "normal" | "warning" | "danger" | "critical";
  primaryFactor?: string;
}

export interface RecoveryPrognosis {
  trend: "improving" | "stable" | "worsening";
  expectedRecoveryHours: number;
  recommendation: string;
}

export interface ActivityContext {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  // Adjustment factors
  recallBias: number; // multiplier for risk warnings (catch more)
  crashPenalty: number; // multiplier for avoiding crashes
  sensitivity: number; // 0-1 multiplier for exertion budget
  isDefault?: boolean;
}

/**
 * Circadian Tracking Types (Spec-010)
 *
 * Type definitions for light exposure, circadian phase alignment, and thermoregulatory patterns.
 * Provides structured data for circadian disruption detection and personalized light recommendations.
 *
 * @see app/lib/types/circadian.ts for detailed type definitions with JSDoc examples
 */

export type SensorType = "ambient_light_sensor" | "motion_pattern" | "manual_entry" | "insufficient_data";
export type Season = "winter" | "summer" | "transition";
export type DataQuality = "excellent" | "good" | "fair" | "poor";

/**
 * Daily circadian metrics captured from light sensors, motion patterns, or manual entry.
 *
 * Tracks light exposure timing, circadian phase alignment, and thermal-circadian coupling.
 * Null values indicate insufficient sensor data for that metric.
 *
 * @see DailyCircadianMetrics in app/lib/types/circadian.ts for full JSDoc documentation
 */
export interface DailyCircadianMetrics {
  /** Date in YYYY-MM-DD format */
  date: string;

  /** Total outdoor light exposure in minutes (0-180 typical range) */
  outdoorTimeMinutes: number | null;

  /** Peak light exposure timing in HH:MM format (ideally 7am-10am) */
  peakLightTiming: string | null;

  /** Circadian phase shift in hours (-12 to +12, 0 = solar alignment) */
  circadianPhaseShift: number | null;

  /** Light exposure consistency (0-1, 1 = perfectly consistent timing) */
  lightExposureConsistency: number | null;

  /** Thermal-circadian coupling (0-1, 1 = perfect alignment) */
  thermalCircadianInteraction: number | null;

  /** Morning light exposure during 6am-10am window in minutes */
  morningLightMinutes: number | null;

  /** Data source type for this day */
  sensorType: SensorType;

  /** Confidence in sensor readings (0-1) */
  sensorConfidence: number;

  /** Season classification for baseline adjustments */
  season: Season;

  /** Autonomic Stress Index (0-3+, higher = more stress) */
  autonomicStressIndex: number | null;

  /** HRV day-to-night ratio (<0.8 = tired-but-wired pattern) */
  hrvDayToNightRatio: number | null;

  /** Optional metadata about sensor quality and collection */
  metadata?: {
    /** Total sensor reading duration in minutes (1440 = full day) */
    sensorReadingsDuration: number;
    /** Whether user manually overrode sensor data */
    manuallyOverridden: boolean;
    /** ISO 8601 timestamp of most recent sensor reading */
    lastSensorReading: string;
    /** Qualitative data quality assessment */
    dataQuality: DataQuality;
  };
}

/**
 * Circadian baseline metrics for a time period.
 *
 * Calculated from 7-30 days of DailyCircadianMetrics.
 * Used as reference for detecting circadian disruption and validating recommendations.
 * Updated weekly or on user request via "Recalibrate Circadian" action.
 *
 * @see CircadianBaseline in app/lib/types/circadian.ts for full JSDoc documentation
 */
export interface CircadianBaseline {
  /** Season during which baseline was established */
  season: "winter" | "summer";

  /** Start date of baseline period (YYYY-MM-DD) */
  startDate: string;

  /** End date of baseline period (YYYY-MM-DD) */
  endDate: string;

  /** Mean outdoor light exposure in minutes for period */
  meanOutdoorMinutes: number;

  /** Standard deviation of outdoor time in minutes */
  stdOutdoorMinutes: number;

  /** Typical peak light timing in HH:MM format */
  typicalPeakTime: string;

  /** Standard deviation of circadian phase shift in hours */
  phaseShiftStd: number;

  /** Morning light benefit correlation with recovery (0-1) */
  morningLightBenefit: number;

  /** Mean HRV for this season in milliseconds */
  hrvSeasonalMean: number;

  /** Mean Recovery Score for this season (0-100) */
  recoverySeasonalMean: number;

  /** ISO 8601 timestamp when baseline was last recalibrated */
  lastRecalibratedAt: string;
}
