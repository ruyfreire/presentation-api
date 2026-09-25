import { NestFactory } from '@nestjs/core'
import { getConnectionToken, getModelToken } from '@nestjs/mongoose'
import { NestExpressApplication } from '@nestjs/platform-express'
import {
  MongoDBAtlasLocalContainer,
  type StartedMongoDBAtlasLocalContainer,
} from '@testcontainers/mongodb'
import bcrypt from 'bcrypt'
import type { Connection, Model } from 'mongoose'
import { configureApplication } from 'src/configure-application'
import { User } from 'src/modules/auth/entities'
import type { UserDocument } from 'src/modules/auth/repositories/mongoose/schema'
import { ProfileDto } from 'src/modules/profile/dtos/profile.dto'
import request from 'supertest'
import TestAgent from 'supertest/lib/agent'
import { Wait } from 'testcontainers'

import { createProfileFixture } from '../support/fixtures/profile'

describe('Application E2E', () => {
  let app: NestExpressApplication
  let mongo: StartedMongoDBAtlasLocalContainer
  let connection: Connection
  let agent: TestAgent
  let csrfToken = ''
  let profileDto: ProfileDto

  const credentials = {
    email: 'e2e@example.com',
    password: 'e2e-password',
  }

  beforeAll(async () => {
    mongo = await new MongoDBAtlasLocalContainer('mongo:8.0')
      .withWaitStrategy(Wait.forLogMessage('Waiting for connections'))
      .start()

    process.env.MONGODB_URI = `${mongo.getConnectionString()}presentation-e2e`

    const { AppModule } = jest.requireActual<
      typeof import('../../src/app.module.js')
    >('../../src/app.module')

    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: false,
    })
    configureApplication(app)
    await app.init()

    connection = app.get<Connection>(getConnectionToken())
    agent = request.agent(app.getHttpServer())

    const userModel = app.get<Model<UserDocument>>(getModelToken(User.name))
    await userModel.create({
      email: credentials.email,
      password: await bcrypt.hash(credentials.password, 4),
    })
  }, 60_000)

  afterAll(async () => {
    await connection.dropDatabase()
    await app.close()
    await mongo.stop()
  })

  it('authenticate user [POST /auth/signin]', async () => {
    const signinResponse = await agent
      .post('/auth/signin')
      .send(credentials)
      .expect(200)

    expect(signinResponse.body).toMatchObject({
      message: 'Signed in successfully',
      data: {
        csrfToken: expect.any(String) as string,
      },
    })

    csrfToken = (signinResponse.body as { data: { csrfToken: string } }).data
      .csrfToken
  })

  it('authenticated user [GET /auth/me]', async () => {
    await agent.get('/auth/me').expect(200)
  })

  it('create profile version [POST /profile]', async () => {
    profileDto = createProfileFixture()

    const createdResponse = await agent
      .post('/profile')
      .set('x-csrf-token', csrfToken)
      .send(profileDto)
      .expect(201)

    expect(createdResponse.body).toMatchObject({
      message: 'Profile created successfully',
      data: { ...profileDto, version: 1 },
    })
  })

  it('read profile [GET /profile]', async () => {
    const fetchedResponse = await agent
      .get('/profile')
      .query({ profileId: profileDto.profileId })
      .expect(200)

    expect(fetchedResponse.body).toMatchObject({
      message: 'Profile fetched successfully',
      data: { ...profileDto, version: 1 },
    })
  })

  it('sign out [POST /auth/logout]', async () => {
    const logoutResponse = await agent
      .post('/auth/logout')
      .set('x-csrf-token', csrfToken)
      .expect(200)

    const cookies = (logoutResponse.headers['set-cookie'] ||
      []) as unknown as string[]

    expect(cookies.toString()).toContain('access-token=;')
    expect(cookies.toString()).toContain('x-csrf-token=;')

    await agent.get('/auth/me').expect(401)
  })

  it('unauthenticated user [GET /auth/me]', async () => {
    await agent.get('/auth/me').expect(401)
  })
})
