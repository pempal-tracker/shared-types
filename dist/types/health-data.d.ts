export interface HealthSnapshot {
    id: string;
    timestamp: Date;
    heartRate: number;
    hrv: number;
    skinTemperature: number;
    steps: number;
    sleepScore: number;
    recoveryIndex: number;
    movementIndex: number;
    source: "ultrahuman" | "manual";
}
export interface DailyMetrics {
    date: string;
    avgHeartRate: number;
    avgHrv: number;
    minHrv: number;
    maxHrv: number;
    avgTemperature: number;
    totalSteps: number;
    sleepScore: number;
    recoveryIndex: number;
    sleepDuration: number;
    deepSleep: number;
    remSleep: number;
    lightSleep: number;
}
export interface PEMPrediction {
    timestamp: Date;
    riskScore: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    confidence: number;
    confidenceInterval: number;
    typicalRisk: number;
    forecastDate: string;
    factors: PEMFactor[];
    recommendation: string;
    preventativeAdvice: string[];
    energyCapacityPercent?: number;
    activityBudgetMinutes?: number;
    scenarioRisks?: {
        rest: number;
        normal: number;
        active: number;
    };
    morningLightGuidance?: {
        recommendLight: boolean;
        minutesNeeded: number;
        optimalWindow: string;
        benefit: string;
    };
}
export interface PEMFactor {
    name: string;
    contribution: number;
    value: number;
    threshold: number;
    status: "normal" | "elevated" | "critical";
    direction?: "impact" | "protection";
    description?: string;
}
export interface TiredButWiredAlert {
    timestamp: Date;
    isActive: boolean;
    eveningHrDeviation: number;
    thermalFailure: boolean;
    hrvSuppression: number;
    hrvDayToNightRatio: number | null;
    autonomicStressIndex: number | null;
    severity: "mild" | "moderate" | "severe";
}
export interface ACWRMetrics {
    date: string;
    acuteLoad: number;
    chronicLoad: number;
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
        heart_rate?: {
            timestamp: string;
            value: number;
        }[];
        hrv?: {
            timestamp: string;
            rmssd: number;
            sdnn: number;
        }[];
        sleep?: {
            date: string;
            score: number;
            duration: number;
            deep_sleep: number;
            rem_sleep: number;
            light_sleep: number;
        };
        temperature?: {
            timestamp: string;
            value: number;
        }[];
        steps?: {
            timestamp: string;
            count: number;
        }[];
        recovery?: {
            date: string;
            index: number;
        };
        movement?: {
            date: string;
            index: number;
        };
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
    deviation: number;
    deviationPercent: number;
    trend: MetricTrend;
    trendValues: number[];
    status: "normal" | "warning" | "danger";
    riskImpact: number;
    context?: string;
    sleepArchitecture?: SleepArchitecture;
}
export type ActivityType = "Physical (Light)" | "Physical (Moderate)" | "Cognitive (Deep Work)" | "Social (High Energy)" | "Social (Low Energy)";
export type DiscoveryCategory = "temporal" | "activity" | "physiological" | "compound";
export interface SimulatedOutcome {
    riskIncrease: number;
    recoveryHours: number;
    warnings: string[];
}
export interface DiscoveredPattern {
    id: string;
    category: DiscoveryCategory;
    title: string;
    description: string;
    insight: string;
    confidence: number;
    significance: number;
    lastObserved?: string;
}
export interface TemporalStatus {
    date: string | number;
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
    icon: string;
    color: string;
    recallBias: number;
    crashPenalty: number;
    sensitivity: number;
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
