export const RENDER_ENGINE = {
  provider: 'provider',
  cliam: 'cliam',
  self: 'self'
} as const;

export type RenderEngine = typeof RENDER_ENGINE[keyof typeof RENDER_ENGINE];
