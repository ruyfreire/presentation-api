import z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  MONGODB_URI: z.string({
    error: 'MONGODB_URI environment is required',
  }),
  JWT_SECRET: z.string({
    error: 'JWT_SECRET environment is required',
  }),
})
