// app/lib/pricingPlans.ts

export const pricingPlans = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basic access', 'Limited storage'],
    stripePriceId: 'price_xxxxxxxxxxxxx' // Replace with actual Stripe Price ID
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    features: ['Advanced access', 'Unlimited storage', 'Priority support'],
    stripePriceId: 'price_xxxxxxxxxxxxx' // Replace with actual Stripe Price ID
  }
};