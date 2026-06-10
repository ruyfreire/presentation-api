import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from './database/database.module'
import { ProfileModule } from './modules/profile/profile.module'
import { envSchema } from './utils/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (objectEnvs) => envSchema.parse(objectEnvs),
    }),
    DatabaseModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
