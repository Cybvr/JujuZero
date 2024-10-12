export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 10,
    features: ['All Free features', 'Pro Feature 1', 'Pro Feature 2', 'Pro Feature 3'],
  },
];