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
import { getAuthCookieOptions } from 'src/utils/auth-cookie'
import { Env } from 'src/utils/env'

import { Public } from '../auth.decorators'
import { SigninDto } from '../dtos/signin.dto'
import { SigninService } from '../services/signin.service'

@Controller('auth')
@ApiTags('Auth')
export class SigninController {
  private readonly logger = new Logger(SigninController.name)

  constructor(
    private readonly signinService: SigninService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @ApiOperation({ summary: 'Sign in and set the HttpOnly JWT cookie' })
  @ApiOkResponse({
    description:
      'Signed in successfully. JWT is set in the HttpOnly cookie and the CSRF token is returned in the body.',
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
              example: '1234567890',
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
    const jwtCookieName = this.configService.getOrThrow('JWT_COOKIE_NAME', {
      infer: true,
    })

    res.cookie(jwtCookieName, accessToken, getAuthCookieOptions())

    req.cookies[jwtCookieName] = accessToken

    const csrfToken = req.csrfToken?.()

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
