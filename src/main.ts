import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { env } from './utils/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Presentation API')
    .setDescription(
      'API to serve profile data for the [presentation](https://presentation-nextjs-eta.vercel.app) front-end',
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

  await app.listen(env.PORT, env.HOST)
}

void bootstrap()
