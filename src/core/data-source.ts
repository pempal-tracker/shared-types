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
  date: string; // ISO 8601: YYYY-MM-DD
  sleepScore?: number;
  recoveryScore?: number;
  movementScore?: number;
  totalSteps?: number;
  totalCalories?: number;
  totalSleep?: number; // minutes
  sleepAwakeTime?: number;
  deepSleep?: number;
  remSleep?: number;
  lightSleep?: number;
  sleepEfficiency?: number; // %
  perceivedRecovery?: number;
  phaseAdvanceSteps?: number;
  averageTemperature?: number; // °C
  averageRHR?: number; // bpm
  averageHRV?: number; // ms (RMSSD)
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
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
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
export class MockDataSource implements DataSource {
  private metrics: DailyMetrics[] = [];
  private crashes: CrashEvent[] = [];
  private profile: UserProfile | null = null;

  constructor(metrics?: DailyMetrics[], crashes?: CrashEvent[]) {
    this.metrics = metrics || [];
    this.crashes = crashes || [];
  }

  async getMetrics(range: DateRange): Promise<DailyMetrics[]> {
    return this.metrics.filter(m => {
      const d = new Date(m.date);
      return d >= range.start && d <= range.end;
    });
  }

  async getCrashEvents(range: DateRange): Promise<CrashEvent[]> {
    return this.crashes.filter(c => {
      const start = new Date(c.startDate);
      return start >= range.start && start <= range.end;
    });
  }

  async savePredictions(predictions: PEMPrediction[]): Promise<void> {
    // Store in memory for testing
    console.log('Mock: Saved', predictions.length, 'predictions');
  }

  async getProfile(): Promise<UserProfile> {
    if (this.profile) {
      return this.profile;
    }

    // Calculate from mock metrics
    return {
      dateRange: {
        start: this.metrics[0]?.date || new Date().toISOString().split('T')[0],
        end: this.metrics[this.metrics.length - 1]?.date || new Date().toISOString().split('T')[0],
        totalDays: this.metrics.length,
      },
      baselineMetrics: {
        hrvMean: 40,
        hrvStd: 5,
        hrvPercentiles: { p5: 32, p25: 37, p50: 40, p75: 43, p95: 48 },
        rhrMean: 60,
        rhrStd: 8,
        rhrPercentiles: { p5: 50, p25: 54, p50: 60, p75: 66, p95: 75 },
      },
      personalizedThresholds: {
        ventilatory: 75,
        aerobic: 68,
        activityDaily: 8000,
        activityWeekly: 40000,
      },
    };
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<void> {
    this.profile = { ...await this.getProfile(), ...profile } as UserProfile;
  }
}

/**
 * Data source helper: Filter metrics by date range
 */
export function filterByDateRange(
  metrics: DailyMetrics[],
  range: DateRange
): DailyMetrics[] {
  return metrics.filter(m => {
    const d = new Date(m.date);
    return d >= range.start && d <= range.end;
  });
}

/**
 * Data source helper: Get most recent N metrics
 */
export async function getRecentMetrics(
  dataSource: DataSource,
  days: number
): Promise<DailyMetrics[]> {
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  return dataSource.getMetrics({ start, end });
}

/**
 * Data source helper: Get profile and all available metrics
 */
export async function getFullDataset(
  dataSource: DataSource
): Promise<{ metrics: DailyMetrics[]; profile: UserProfile }> {
  const profile = await dataSource.getProfile();
  const metrics = await dataSource.getMetrics({
    start: new Date(profile.dateRange.start),
    end: new Date(profile.dateRange.end),
  });

  return { metrics, profile };
}
