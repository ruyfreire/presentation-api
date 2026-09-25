import { INestApplication } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { getConnectionToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { ConnectionStates } from 'mongoose'
import { HealthModule } from 'src/modules/health/health.module'
import request from 'supertest'
import type { App } from 'supertest/types'

describe('Health HTTP integration', () => {
  let app: INestApplication<App>

  const connection = {
    readyState: ConnectionStates.connected,
    db: {
      command: jest.fn().mockResolvedValue({ ok: 1 }),
    },
    close: jest.fn().mockResolvedValue(undefined),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ MONGODB_URI: 'mongodb://localhost/test' })],
        }),
        HealthModule,
      ],
    })
      .overrideProvider(getConnectionToken())
      .useValue(connection)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('reports the API as available when MongoDB responds', async () => {
    connection.readyState = ConnectionStates.connected
    connection.db.command.mockResolvedValue({ ok: 1 })

    const response = await request(app.getHttpServer()).get('/api-status')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ status: true })
  })

  it('reports the API as unavailable when MongoDB is disconnected', async () => {
    connection.readyState = ConnectionStates.disconnected

    const response = await request(app.getHttpServer()).get('/api-status')

    expect(response.status).toBe(503)
    expect(response.body).toMatchObject({ status: false })
  })
})
