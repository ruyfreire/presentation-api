import z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  MONGODB_URI: z.string({
    error: 'MONGODB_URI environment is required',
  }),
  JWT_COOKIE_NAME: z.string().default('__Host-presentation-api.access-token'),
  JWT_SECRET: z.string({
    error: 'JWT_SECRET environment is required',
  }),
  CSRF_COOKIE_NAME: z.string().default('__Host-presentation-api.x-csrf-token'),
  CSRF_SECRET: z.string({
    error: 'CSRF_SECRET environment is required',
  }),
  COOKIE_EXPIRES_MS: z.coerce.number().default(1000 * 60 * 60 * 24),
  CORS_ORIGINS: z
    .string({
      error: 'CORS_ORIGINS environment is required',
    })
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.url()).min(1)),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)

export function isProductionEnv() {
  return process.env.NODE_ENV === 'production'
}
