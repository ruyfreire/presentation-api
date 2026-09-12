import {
  Controller,
  Get,
  Header,
  ServiceUnavailableException,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Connection, ConnectionStates } from 'mongoose'

import { Public } from '../../auth/auth.decorators'

@Controller('api-status')
@ApiTags('Health')
export class GetHealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @ApiOperation({
    summary: 'Check if the API and the database are online',
  })
  @ApiOkResponse({
    description: 'API and MongoDB are reachable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: true },
      },
    },
  })
  @ApiServiceUnavailableResponse({
    description: 'MongoDB is unreachable',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'boolean', example: false },
      },
    },
  })
  @Public()
  @Header(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  )
  @Header('Pragma', 'no-cache')
  @Header('Expires', '0')
  @Get('')
  async getHealth() {
    const mongo = await this.pingMongo()
    const body = { status: mongo }

    if (!mongo) {
      throw new ServiceUnavailableException(body)
    }

    return body
  }

  private async pingMongo(): Promise<boolean> {
    if (
      this.connection.readyState !== ConnectionStates.connected ||
      !this.connection.db
    ) {
      return false
    }

    try {
      const result = await this.withTimeout(
        this.connection.db.command({ ping: 1 }),
        3000,
      )

      return Number(result.ok) === 1
    } catch {
      return false
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined

    try {
      return await Promise.race([
        promise,
        new Promise<T>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error(`Mongo ping exceeded ${ms}ms`)),
            ms,
          )
        }),
      ])
    } finally {
      clearTimeout(timer)
    }
  }
}
