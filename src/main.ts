import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { doubleCsrf } from 'csrf-csrf'
import helmet from 'helmet'

import { AppModule } from './app.module'
import {
  ACCESS_TOKEN_COOKIE,
  CSRF_TOKEN_COOKIE,
  SKIP_CSRF_PROTECTION_PATHS,
} from './utils/auth-cookie'
import { Env, isProductionEnv } from './utils/env'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)

  app.set('trust proxy', 1)
  app.use(cookieParser())
  app.use(helmet())
  app.enableCors({
    origin: configService.getOrThrow('CORS_ORIGINS', { infer: true }),
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  })
  app.useGlobalPipes(new ValidationPipe())

  const { doubleCsrfProtection } = doubleCsrf({
    cookieName: isProductionEnv() ? undefined : CSRF_TOKEN_COOKIE,
    getSecret: () => configService.getOrThrow('CSRF_SECRET', { infer: true }),
    getSessionIdentifier: (req) =>
      (req.cookies[ACCESS_TOKEN_COOKIE] as string | undefined) || 'anonymous',
    cookieOptions: {
      sameSite: isProductionEnv() ? 'none' : undefined,
      maxAge: configService.getOrThrow('COOKIE_EXPIRES_MS', { infer: true }),
    },
    errorConfig: {
      message: 'Invalid CSRF token',
    },
    skipCsrfProtection: (req) => {
      return SKIP_CSRF_PROTECTION_PATHS.has(req.path)
    },
  })

  app.use(doubleCsrfProtection)

  const config = new DocumentBuilder()
    .setTitle('Presentation API')
    .setDescription(
      `API para servir os dados de perfil para o front-end [presentation](https://presentation-nextjs-eta.vercel.app).
      \n\n **Autenticação**
      \n_Se não atender aos requisitos de autenticação, receberá erro 401 Unauthorized ou 403 Forbidden._
      \n- Todos os endpoints protegidos utilizam cookie HttpOnly com jwt.
      \n- Endpoints de mutação protegidos (POST, PUT, PATCH, DELETE) utilizam cookie HttpOnly com CSRF e exigem o token CSRF no header 'x-csrf-token'.
      `,
    )
    .addGlobalResponse({
      status: 500,
      description: 'Internal Server Error',
    })
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'Presentation API | Ruy Freire',
    customCss: `.title span { display: none; }`,
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      deepLinking: false,
      supportedSubmitMethods: [],
    },
  })

  await app.listen(
    configService.getOrThrow('PORT', { infer: true }),
    configService.getOrThrow('HOST', { infer: true }),
  )
}

void bootstrap()
