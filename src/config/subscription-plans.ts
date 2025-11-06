// Subscription plan configuration
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  limits: {
    qrCodes: number; // -1 for unlimited
    scans: number; // -1 for unlimited
    customBranding: boolean;
    analytics: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    stripePriceIds: {
      monthly: '',
      yearly: '',
    },
    features: [
      '10 QR codes per month',
      '100 scans per month',
      'Basic QR code styles',
      'PNG & SVG download',
      'Email support',
    ],
    limits: {
      qrCodes: 10,
      scans: 100,
      customBranding: false,
      analytics: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and small businesses',
    price: {
      monthly: 19,
      yearly: 190, // ~16/month
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_MONTHLY || 'price_pro_monthly',
      yearly: process.env.STRIPE_PRICE_YEARLY || 'price_pro_yearly',
    },
    features: [
      '1,000 QR codes per month',
      '100,000 scans per month',
      'Advanced QR code customization',
      'Custom logo & branding',
      'Scan analytics & insights',
      'All download formats',
      'Priority email support',
      'No QRLoom watermark',
    ],
    limits: {
      qrCodes: 1000,
      scans: 100000,
      customBranding: true,
      analytics: true,
      apiAccess: false,
      prioritySupport: true,
    },
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: {
      monthly: 99,
      yearly: 990, // ~83/month
    },
    stripePriceIds: {
      monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
      yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
    },
    features: [
      'Unlimited QR codes',
      'Unlimited scans',
      'Advanced analytics & reporting',
      'Custom branding & white-label',
      'API access',
      'Team collaboration',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom integrations',
      'SLA guarantee',
    ],
    limits: {
      qrCodes: -1, // unlimited
      scans: -1, // unlimited
      customBranding: true,
      analytics: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
};

// Helper to get plan by tier
export function getPlanByTier(tier: SubscriptionTier): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[tier];
}

// Helper to check if feature is available in tier
export function hasFeature(
  tier: SubscriptionTier,
  feature: 'customBranding' | 'analytics' | 'apiAccess' | 'prioritySupport'
): boolean {
  return SUBSCRIPTION_PLANS[tier].limits[feature];
}

// Helper to get limit value
export function getLimit(tier: SubscriptionTier, limit: 'qrCodes' | 'scans'): number {
  return SUBSCRIPTION_PLANS[tier].limits[limit];
}
