import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Response } from 'express'
import { clearAuthCookies } from 'src/utils/auth-cookie'

@Controller('auth')
@ApiTags('Auth')
export class LogoutController {
  @ApiOperation({
    summary: 'Clear the authentication and CSRF cookies [Protected]',
  })
  @ApiOkResponse({
    description: 'Cookies cleared successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Signed out successfully',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    clearAuthCookies(res)

    return {
      message: 'Signed out successfully',
    }
  }
}
