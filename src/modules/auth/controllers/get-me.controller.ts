import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Req,
} from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import type { Request } from 'express'

import { CurrentUser } from '../auth.decorators'
import type { JwtUser } from '../types/jwt.types'

@Controller('auth')
@ApiTags('Auth')
export class GetMeController {
  private readonly logger = new Logger(GetMeController.name)

  @ApiOperation({
    summary: 'Return the authenticated user [Protected]',
  })
  @ApiOkResponse({
    description:
      'Authenticated. JWT cookie is valid. Returns the logged-in user and CSRF token.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Authenticated',
        },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  example: '507f1f77bcf86cd799439011',
                },
              },
              example: {
                id: '507f1f77bcf86cd799439011',
              },
            },
            csrfToken: {
              type: 'string',
              example: '1234567890',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  getMe(@CurrentUser() user: JwtUser, @Req() req: Request) {
    const csrfToken = req.csrfToken?.()

    if (!csrfToken) {
      this.logger.error('Failed to generate CSRF token')
      throw new InternalServerErrorException('Failed to generate CSRF token')
    }

    return {
      message: 'Authenticated',
      data: { user, csrfToken },
    }
  }
}
