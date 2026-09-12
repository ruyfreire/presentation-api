import z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  MONGODB_URI: z.string({
    error: 'MONGODB_URI environment is required',
  }),
  JWT_SECRET: z.string({
    error: 'JWT_SECRET environment is required',
  }),
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

export const env = envSchema.parse(process.env)
