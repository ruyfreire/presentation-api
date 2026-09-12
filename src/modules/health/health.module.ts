import { Module } from '@nestjs/common'

import { DatabaseModule } from '../../database/database.module'
import { GetHealthController } from './controllers'

@Module({
  imports: [DatabaseModule],
  controllers: [GetHealthController],
})
export class HealthModule {}
