export const ACCESS_TOKEN_COOKIE = 'access_token'

export const CSRF_TOKEN_COOKIE = 'x-csrf-token'

export const SKIP_CSRF_PROTECTION_PATHS = new Set(['/auth/signin'])

export function getCookieValue(
  cookies: Record<string, unknown> | undefined,
  name: string,
) {
  const value = cookies?.[name]
  return typeof value === 'string' ? value : null
}
