import { Controller, Get, Header, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { Public } from '../../auth/auth.decorators'

@Controller('health')
@ApiTags('Health')
export class GetHealthController {
  @ApiOperation({ summary: 'Check if the API is online' })
  @ApiNoContentResponse({ description: 'API is online' })
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @Get('')
  getHealth() {}
}
