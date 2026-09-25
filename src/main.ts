import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { configureApplication } from './configure-application'
import { Env } from './utils/env'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)

  configureApplication(app)

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
