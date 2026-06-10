import z from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string({
    error: 'MONGODB_URI environment is required',
  }),
})
