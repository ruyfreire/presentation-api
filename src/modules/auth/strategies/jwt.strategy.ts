import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { getCookieValue } from 'src/utils/auth-cookie'
import { Env } from 'src/utils/env'

import { JwtPayload, JwtUser } from '../types/jwt.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<Env, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return getCookieValue(
            request.cookies,
            configService.getOrThrow('JWT_COOKIE_NAME', { infer: true }),
          )
        },
      ]),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    })
  }

  validate(payload: JwtPayload): JwtUser {
    return { id: payload.sub }
  }
}
