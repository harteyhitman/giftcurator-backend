/**
 * Single source for signing/verifying API JWTs. Must match between JwtModule and JwtStrategy.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production');
  }
  return 'development-only-jwt-secret-do-not-use-in-production';
}
