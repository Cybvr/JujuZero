// Import Timestamp directly from Firestore
import { Timestamp } from 'firebase/firestore';

export type Project = {
  name: string;
  tagline?: string;
  logo?: string;

  // Brand Strategy
  brandStrategy?: {
    mission?: string;
    vision?: string;
    targetAudience?: string;
    positioning?: string;
  };

  // Visual Identity
  visualIdentity?: {
    logoDescription?: string;
    colorPalette?: string[];
    typography?: {
      primary?: string;
      secondary?: string;
    };
  };

  // Brand Voice
  brandVoice?: {
    toneOfVoice?: string;
    keyMessages?: string[];
  };

  // Social Media - Merged field with posts array
  socialMedia?: {
    posts?: {
      platform: string;
      post: string;
      hashtags: string[];
      cta: string;
    }[];
  };

  // SEO Insights - Field with keywords and meta description
  seoInsights?: {
    keywords?: {
      keyword: string;
      volume: number;
      difficulty: string;
    }[];
    metaDescription?: string;
  };

  // Timestamps, Collaborators, and User Info
  createdAt?: Timestamp;  // Use Timestamp from Firestore
  updatedAt?: Timestamp;  // Use Timestamp from Firestore
  collaborators?: string[];
  userId?: string;
};
