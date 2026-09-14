import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { Env } from 'src/utils/env'

import { LogoutController, SigninController } from './controllers'
import { User } from './entities'
import { UserMongooseRepository } from './repositories/mongoose/repository'
import { UserSchema } from './repositories/mongoose/schema'
import { UserRepository } from './repositories/user-repository'
import { USER_REPOSITORY } from './repositories/user-repository.interface'
import { SigninService } from './services'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env, true>) => ({
        secret: configService.getOrThrow('JWT_SECRET', { infer: true }),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SigninController, LogoutController],
  providers: [
    UserRepository,
    {
      provide: USER_REPOSITORY,
      useClass: UserMongooseRepository,
    },
    SigninService,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
