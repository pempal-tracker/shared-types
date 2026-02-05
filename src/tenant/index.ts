/**
 * Multi-Tenancy Types
 *
 * Tenant hierarchy and role-based access control types for white-labeling.
 */

/**
 * Tenant branding configuration
 */
export interface TenantBranding {
  /** URL to logo image */
  logo: string;
  /** Primary brand color (hex) */
  primaryColor: string;
  /** Secondary brand color (hex) */
  secondaryColor: string;
  /** Accent color (hex) */
  accentColor: string;
  /** Font family */
  font: 'Inter' | 'Roboto' | 'Open Sans' | 'Lato';
  /** URL to favicon */
  favicon?: string;
}

/**
 * Tenant feature settings
 */
export interface TenantSettings {
  /** Enabled features */
  features: {
    csvImport: boolean;
    realTimeSync: boolean;
    aiPredictions: boolean;
    circadianAnalysis: boolean;
    activityBudgeting: boolean;
    crashLabeling: boolean;
    featureImportance: boolean;
  };
  /** Custom content */
  customContent?: {
    helpDocs?: string;
    privacyPolicy?: string;
    termsOfService?: string;
    faq?: string;
  };
}

/**
 * Tenant (clinic/practice)
 *
 * Represents a clinic or practice with parent-child hierarchy support.
 */
export interface Tenant {
  /** Unique tenant ID */
  id: string;
  /** Parent tenant ID (null for root clinics) */
  parentTenantId: string | null;
  /** Tenant name */
  name: string;
  /** Subdomain (e.g., 'vermoeidheidkliniek') */
  subdomain: string;
  /** Custom domain (e.g., 'vermoeidheidkliniek.nl') */
  customDomain?: string | null;
  /** Geographic region for data residency */
  region: 'EU' | 'US' | 'APAC';
  /** Pricing tier */
  tier: 'free' | 'pro' | 'enterprise';
  /** Branding configuration */
  branding: TenantBranding;
  /** Feature settings */
  settings: TenantSettings;
  /** Created timestamp */
  createdAt: Date;
  /** Last updated timestamp */
  updatedAt: Date;
}

/**
 * User role with flexible permissions
 */
export interface Role {
  /** Unique role ID */
  id: string;
  /** Tenant ID (null for global/system roles) */
  tenantId: string | null;
  /** Role name */
  name: string;
  /** Parent role ID for permission inheritance */
  parentRoleId?: string | null;
  /** Permission claims */
  permissions: {
    /** Resource claims (e.g., ['patients:read', 'metrics:write']) */
    claims: string[];
    /** Resource access patterns */
    resources?: Record<string, string[]>;
  };
  /** System role (cannot be deleted/modified) */
  isSystemRole: boolean;
}

/**
 * Standard system roles
 */
export type SystemRole = 'super_admin' | 'clinic_admin' | 'doctor' | 'patient';

/**
 * User account
 */
export interface User {
  /** Unique user ID */
  id: string;
  /** Tenant ID */
  tenantId: string;
  /** Email address */
  email: string;
  /** Role ID */
  roleId: string;
  /** User's full name */
  name?: string;
  /** Avatar URL */
  avatar?: string;
  /** Date of birth (for patients) */
  dateOfBirth?: Date;
  /** Onboarding completed */
  onboardingComplete: boolean;
  /** Created timestamp */
  createdAt: Date;
  /** Last login timestamp */
  lastLoginAt?: Date;
}

/**
 * Authentication user (session context)
 */
export interface AuthUser {
  /** User ID */
  id: string;
  /** Tenant ID */
  tenantId: string;
  /** Email */
  email: string;
  /** Display name */
  name?: string;
  /** Avatar URL */
  avatar?: string;
  /** Role */
  role: SystemRole | string;
  /** OAuth provider */
  provider?: 'ultrahuman' | 'google' | 'email';
}

/**
 * Tenant context for row-level security
 */
export interface TenantContext {
  /** Current tenant ID */
  tenantId: string;
  /** Current user ID */
  userId: string;
  /** Current user role */
  userRole: SystemRole | string;
}
