import './instrument'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 4000, process.env.HOST || '0.0.0.0')
}

void bootstrap()
