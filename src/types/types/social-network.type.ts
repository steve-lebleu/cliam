export const SOCIAL_NETWORK = {
  facebook: 'facebook',
  twitter: 'twitter',
  youtube: 'youtube',
  google: 'google',
  github: 'github',
  linkedin: 'linkedin',
} as const;

/**
 * @description Social networks used as placeholder
 */
export type SocialNetwork = typeof SOCIAL_NETWORK[keyof typeof SOCIAL_NETWORK];
