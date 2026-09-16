import { Controller, Get } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { CurrentUser } from '../auth.decorators'
import type { JwtUser } from '../types/jwt.types'

@Controller('auth')
@ApiTags('Auth')
export class GetMeController {
  @ApiOperation({
    summary: 'Return the authenticated user [Protected]',
  })
  @ApiOkResponse({
    description:
      'Authenticated. JWT cookie is valid. Returns the logged-in user.',
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
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return {
      message: 'Authenticated',
      data: { user },
    }
  }
}
