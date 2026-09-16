import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'
import { ACCESS_TOKEN_COOKIE } from 'src/utils/auth-cookie'
import { Env, isProductionEnv } from 'src/utils/env'

import { Public } from '../auth.decorators'
import { SigninDto } from '../dtos/signin.dto'
import { SigninService } from '../services/signin.service'

@Controller('auth')
@ApiTags('Auth')
export class SigninController {
  private readonly isProduction = isProductionEnv()
  private readonly logger = new Logger(SigninController.name)

  constructor(
    private readonly signinService: SigninService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @ApiOperation({ summary: 'Sign in and set the HttpOnly JWT cookie' })
  @ApiOkResponse({
    description:
      'Signed in successfully. JWT is set in the HttpOnly access_token cookie and the CSRF token is returned in the body.',
    headers: {
      'Set-Cookie': {
        description: 'HttpOnly JWT cookie named access_token',
        schema: {
          type: 'string',
          example: 'access_token=...; Path=/; HttpOnly; SameSite=Lax',
        },
      },
    },
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Signed in successfully',
        },
        data: {
          type: 'object',
          properties: {
            csrfToken: {
              type: 'string',
              example: 'csrf-token',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.signinService.execute(signinDto)
    const maxAge = this.configService.getOrThrow('COOKIE_EXPIRES_MS', {
      infer: true,
    })

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: this.isProduction ? 'none' : 'lax',
      secure: this.isProduction,
      path: '/',
      maxAge,
    })

    req.cookies[ACCESS_TOKEN_COOKIE] = accessToken

    const csrfToken = req.csrfToken?.({ overwrite: true })

    if (!csrfToken) {
      this.logger.error('Failed to generate CSRF token')
      throw new InternalServerErrorException('Failed to generate CSRF token')
    }

    return {
      message: 'Signed in successfully',
      data: { csrfToken },
    }
  }
}
