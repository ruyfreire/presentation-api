import type { CookieOptions, Response } from 'express'

import { env, isProductionEnv } from './env'

export const SKIP_CSRF_PROTECTION_PATHS = new Set(['/auth/signin'])

export function getAuthCookieOptions(
  overrides: CookieOptions = {},
): CookieOptions {
  const isProduction = isProductionEnv()
  const maxAge = env.COOKIE_EXPIRES_MS

  return {
    httpOnly: true,
    path: '/',
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    maxAge,
    ...overrides,
  }
}

export function clearAuthCookies(res: Response) {
  const options = getAuthCookieOptions()

  res.clearCookie(env.JWT_COOKIE_NAME, options)
  res.clearCookie(env.CSRF_COOKIE_NAME, options)
}

export function getCookieValue(
  cookies: Record<string, unknown> | undefined,
  name: string,
) {
  const value = cookies?.[name]
  return typeof value === 'string' ? value : null
}
