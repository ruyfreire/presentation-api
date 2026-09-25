import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { doubleCsrf } from 'csrf-csrf'
import helmet from 'helmet'

import {
  getAuthCookieOptions,
  SKIP_CSRF_PROTECTION_PATHS,
} from './utils/auth-cookie'
import { Env } from './utils/env'

export function configureApplication(app: NestExpressApplication) {
  const configService = app.get<ConfigService<Env, true>>(ConfigService)

  app.set('trust proxy', 1)
  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    origin: configService.getOrThrow('CORS_ORIGINS', { infer: true }),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'content-type',
      'x-csrf-token',
      'pragma',
      'cache-control',
      'newrelic',
      'traceparent',
      'tracestate',
    ],
    exposedHeaders: ['newrelic', 'traceparent', 'tracestate'],
  })
  app.useGlobalPipes(new ValidationPipe())

  const { doubleCsrfProtection } = doubleCsrf({
    cookieName: configService.getOrThrow('CSRF_COOKIE_NAME', { infer: true }),
    getSecret: () => configService.getOrThrow('CSRF_SECRET', { infer: true }),
    getSessionIdentifier: (req) =>
      (req.cookies[
        configService.getOrThrow('JWT_COOKIE_NAME', { infer: true })
      ] as string | undefined) || 'anonymous',
    cookieOptions: getAuthCookieOptions(),
    errorConfig: {
      message: 'Invalid CSRF token',
    },
    skipCsrfProtection: (req) => {
      return SKIP_CSRF_PROTECTION_PATHS.has(req.path)
    },
  })

  app.use(doubleCsrfProtection)
}
