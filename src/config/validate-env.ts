/**
 * Fail fast on missing critical configuration (production).
 */
export function validateBackendEnv(): void {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL?.trim()) {
      throw new Error('DATABASE_URL is required in production');
    }
    if (!process.env.JWT_SECRET?.trim()) {
      throw new Error('JWT_SECRET is required in production');
    }
  }
}
