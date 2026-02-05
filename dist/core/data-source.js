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
/**
 * Mock data source for testing
 */
export class MockDataSource {
    metrics = [];
    crashes = [];
    profile = null;
    constructor(metrics, crashes) {
        this.metrics = metrics || [];
        this.crashes = crashes || [];
    }
    async getMetrics(range) {
        return this.metrics.filter(m => {
            const d = new Date(m.date);
            return d >= range.start && d <= range.end;
        });
    }
    async getCrashEvents(range) {
        return this.crashes.filter(c => {
            const start = new Date(c.startDate);
            return start >= range.start && start <= range.end;
        });
    }
    async savePredictions(predictions) {
        // Store in memory for testing
        console.log('Mock: Saved', predictions.length, 'predictions');
    }
    async getProfile() {
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
    async updateProfile(profile) {
        this.profile = { ...await this.getProfile(), ...profile };
    }
}
/**
 * Data source helper: Filter metrics by date range
 */
export function filterByDateRange(metrics, range) {
    return metrics.filter(m => {
        const d = new Date(m.date);
        return d >= range.start && d <= range.end;
    });
}
/**
 * Data source helper: Get most recent N metrics
 */
export async function getRecentMetrics(dataSource, days) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    return dataSource.getMetrics({ start, end });
}
/**
 * Data source helper: Get profile and all available metrics
 */
export async function getFullDataset(dataSource) {
    const profile = await dataSource.getProfile();
    const metrics = await dataSource.getMetrics({
        start: new Date(profile.dateRange.start),
        end: new Date(profile.dateRange.end),
    });
    return { metrics, profile };
}
