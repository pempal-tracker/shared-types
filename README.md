# @pempal-tracker/shared-types

Shared TypeScript types and interfaces for the PEMPal multi-tenant health tracking platform.

## Installation

```bash
npm install @pempal-tracker/shared-types
```

## What's Included

### Core Abstractions
- `DataSource` - Interface for data sources (CSV, API, Plugin)
- `StorageBackend` - Interface for storage backends (DuckDB, PostgreSQL)
- `UserProfile` - User baseline metrics and percentiles
- `CrashEvent` - Recovery period detection

### Health Data Types
- `DailyMetrics` - Aggregated daily health metrics
- `PEMPrediction` - Crash risk prediction with confidence
- `PEMFactor` - Individual risk factors
- `TiredButWiredAlert` - Autonomic dysregulation patterns
- `CircadianMetrics` - Light exposure and phase alignment

### Multi-Tenancy Types (New!)
- `Tenant` - Clinic/practice with white-labeling
- `TenantBranding` - Logo, colors, fonts customization
- `TenantSettings` - Feature toggles and custom content
- `Role` - Flexible role system with permission inheritance
- `User` - Tenant-scoped user accounts
- `AuthUser` - Authentication session context
- `TenantContext` - Row-level security context

## Usage

```typescript
import {
  DataSource,
  DailyMetrics,
  Tenant,
  User,
  TenantBranding
} from '@pempal-tracker/shared-types';

// Implement a data source
class MyDataSource implements DataSource {
  async getMetrics(range: DateRange): Promise<DailyMetrics[]> {
    // Implementation
  }
}

// Create a tenant
const tenant: Tenant = {
  id: 'clinic-123',
  parentTenantId: null,
  name: 'Vermoeidheidkliniek',
  subdomain: 'vermoeidheidkliniek',
  customDomain: 'vermoeidheidkliniek.nl',
  region: 'EU',
  tier: 'pro',
  branding: {
    logo: 'https://...',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    font: 'Inter'
  },
  settings: {
    features: {
      csvImport: true,
      realTimeSync: true,
      aiPredictions: true,
      circadianAnalysis: true,
      activityBudgeting: true,
      crashLabeling: false,
      featureImportance: false
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## Multi-Tenancy

This package includes types for white-labeling clinics and practices:

- **Tenant Hierarchy**: Parent-child relationships for clinic groups
- **Custom Domains**: vermoeidheidkliniek.nl → your app
- **Branding**: Logo, colors, fonts per tenant
- **Feature Toggles**: Enable/disable features per tenant
- **Row-Level Security**: TenantContext for PostgreSQL RLS policies

## License

MIT
