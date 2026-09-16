import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { DatabaseModule } from './database/database.module'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { HealthModule } from './modules/health/health.module'
import { ProfileModule } from './modules/profile/profile.module'
import { envSchema, isProductionEnv } from './utils/env'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (objectEnvs) => envSchema.parse(objectEnvs),
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60_000, limit: 10 }],
      skipIf: () => !isProductionEnv(),
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    ProfileModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
