// types.ts
export type Project = {
  name: string;
  tagline?: string;
  logo?: string;
  brandStrategy?: {
    mission?: string;
    vision?: string;
    targetAudience?: string;
    positioning?: string;
  };
  visualIdentity?: {
    logoDescription?: string;
    colorPalette?: string[];
    typography?: {
      primary?: string;
      secondary?: string;
    };
  };
  brandVoice?: {
    toneOfVoice?: string;
    keyMessages?: string[];
  };
  socialMedia?: {
    suggestedPosts?: {
      content: string;
      platform: string;
    }[];
  };
};