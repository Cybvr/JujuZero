export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number | 'Unlimited';
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 300,
    features: ['300 credits/month', 'Feature 2', 'Feature 3'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    credits: 'Unlimited',
    features: ['Unlimited credits', 'Pro Feature 1', 'Pro Feature 2', 'Pro Feature 3'],
  },
];