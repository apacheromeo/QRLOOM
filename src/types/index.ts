import { Database } from './supabase';

// Database types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Entity types
export type Profile = Tables<'profiles'>;
export type QRCode = Tables<'qrcodes'>;
export type Scan = Tables<'scans'>;
export type Plan = Tables<'plans'>;
export type Subscription = Tables<'subscriptions'>;

// Enum types
export type PlanType = Enums<'plan_type'>;
export type QRFormat = Enums<'qr_format'>;
export type QRStatus = Enums<'qr_status'>;

// QR Code generation options
export interface QRCodeOptions {
  data: string;
  format: QRFormat;
  foregroundColor?: string;
  backgroundColor?: string;
  logo?: File | string | null;
  width?: number;
  height?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

// QR Code with relations
export interface QRCodeWithScans extends QRCode {
  scans?: Scan[];
  recent_scans?: Scan[];
}

// User with profile and subscription
export interface UserWithDetails {
  id: string;
  email: string;
  profile: Profile;
  subscription?: Subscription;
  plan: Plan;
}

// Analytics data
export interface QRAnalytics {
  total_scans: number;
  scans_by_date: { date: string; count: number }[];
  scans_by_country: { country: string; count: number }[];
  scans_by_device: { device_type: string; count: number }[];
  scans_by_browser: { browser: string; count: number }[];
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Stripe types
export interface StripeSubscriptionData {
  subscriptionId: string;
  customerId: string;
  priceId: string;
  status: string;
  currentPeriodEnd: number;
}

// Form types
export interface QRCodeFormData {
  dataUrl: string;
  title?: string;
  description?: string;
  format: QRFormat;
  foregroundColor: string;
  backgroundColor: string;
  logo?: File | null;
  isDynamic: boolean;
  redirectUrl?: string;
}

// Dashboard stats
export interface DashboardStats {
  total_qr_codes: number;
  total_scans: number;
  scans_this_month: number;
  active_qr_codes: number;
}

// Admin stats
export interface AdminStats extends DashboardStats {
  total_users: number;
  paid_users: number;
  revenue_monthly: number;
  revenue_total: number;
}
