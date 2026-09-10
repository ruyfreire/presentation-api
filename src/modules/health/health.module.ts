import { Module } from '@nestjs/common'

import { GetHealthController } from './controllers'

@Module({
  controllers: [GetHealthController],
})
export class HealthModule {}
