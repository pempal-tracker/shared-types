/**
 * Data Source Abstraction Layer
 *
 * This interface enables the analysis engine to work with multiple data sources:
 * - CSV import (personal data)
 * - Ultrahuman Partner API (production)
 * - Ultrahuman PowerPlugs API (future)
 * - Mock data (testing)
 *
 * By separating data access from analysis, we ensure the same logic works
 * standalone (now) and as a plugin (later) without changes.
 */
export interface DateRange {
    start: Date;
    end: Date;
}
export interface DailyMetrics {
    date: string;
    sleepScore?: number;
    recoveryScore?: number;
    movementScore?: number;
    totalSteps?: number;
    totalCalories?: number;
    totalSleep?: number;
    sleepAwakeTime?: number;
    deepSleep?: number;
    remSleep?: number;
    lightSleep?: number;
    sleepEfficiency?: number;
    perceivedRecovery?: number;
    phaseAdvanceSteps?: number;
    averageTemperature?: number;
    averageRHR?: number;
    averageHRV?: number;
    totalActivityMinutes?: number;
}
export interface CrashEvent {
    startDate: string;
    endDate: string;
    durationDays: number;
    severity?: 'mild' | 'moderate' | 'severe';
    triggers?: string[];
    precedingHRV?: number;
    precedingRHR?: number;
}
export interface PEMPrediction {
    date: string;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    drivers?: string[];
    recommendations?: string[];
    timestamp: string;
}
export interface UserProfile {
    userId?: string;
    dateRange: {
        start: string;
        end: string;
        totalDays: number;
    };
    baselineMetrics: {
        hrvMean: number;
        hrvStd: number;
        hrvPercentiles: {
            p5: number;
            p25: number;
            p50: number;
            p75: number;
            p95: number;
        };
        rhrMean: number;
        rhrStd: number;
        rhrPercentiles: {
            p5: number;
            p25: number;
            p50: number;
            p75: number;
            p95: number;
        };
        sleepMean?: number;
        recoveryMean?: number;
        stepsMean?: number;
    };
    personalizedThresholds: {
        ventilatory: number;
        aerobic: number;
        activityDaily: number;
        activityWeekly: number;
    };
}
/**
 * Core data source interface
 * Implementations: CSV, Partner API, PowerPlugs API, Mock
 */
export interface DataSource {
    /**
     * Retrieve daily metrics for a date range
     */
    getMetrics(range: DateRange): Promise<DailyMetrics[]>;
    /**
     * Detect crash events (periods of missing data or user-reported crashes)
     */
    getCrashEvents(range: DateRange): Promise<CrashEvent[]>;
    /**
     * Save predictions for display/analysis
     */
    savePredictions(predictions: PEMPrediction[]): Promise<void>;
    /**
     * Get or calculate user profile (baselines, thresholds)
     */
    getProfile(): Promise<UserProfile>;
    /**
     * Optional: Get pre-calculated profile if available
     */
    getProfileIfExists?(): Promise<UserProfile | null>;
    /**
     * Optional: Update user profile
     */
    updateProfile?(profile: Partial<UserProfile>): Promise<void>;
}
/**
 * Mock data source for testing
 */
export declare class MockDataSource implements DataSource {
    private metrics;
    private crashes;
    private profile;
    constructor(metrics?: DailyMetrics[], crashes?: CrashEvent[]);
    getMetrics(range: DateRange): Promise<DailyMetrics[]>;
    getCrashEvents(range: DateRange): Promise<CrashEvent[]>;
    savePredictions(predictions: PEMPrediction[]): Promise<void>;
    getProfile(): Promise<UserProfile>;
    updateProfile(profile: Partial<UserProfile>): Promise<void>;
}
/**
 * Data source helper: Filter metrics by date range
 */
export declare function filterByDateRange(metrics: DailyMetrics[], range: DateRange): DailyMetrics[];
/**
 * Data source helper: Get most recent N metrics
 */
export declare function getRecentMetrics(dataSource: DataSource, days: number): Promise<DailyMetrics[]>;
/**
 * Data source helper: Get profile and all available metrics
 */
export declare function getFullDataset(dataSource: DataSource): Promise<{
    metrics: DailyMetrics[];
    profile: UserProfile;
}>;
