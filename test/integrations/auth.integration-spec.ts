import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import cookieParser from 'cookie-parser'
import { DoubleCsrfProtection } from 'csrf-csrf'
import type { Request } from 'express'
import { IS_PUBLIC_KEY } from 'src/modules/auth/auth.decorators'
import { AuthModule } from 'src/modules/auth/auth.module'
import { User } from 'src/modules/auth/entities'
import { USER_REPOSITORY } from 'src/modules/auth/repositories/user-repository.interface'
import { env, envSchema } from 'src/utils/env'
import request from 'supertest'
import type { App } from 'supertest/types'

import { createUserFixture } from '../support/fixtures/user'
import { UserRepositoryInMemory } from '../support/repositories/user-repository.in-memory'

describe('Auth HTTP integration', () => {
  let app: INestApplication<App>
  let repository: UserRepositoryInMemory

  const user = createUserFixture()
  const csrfToken = 'csrf-token'
  const jwtToken = 'jwt-token'

  @Injectable()
  class TestAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getHandler(), context.getClass()],
      )

      if (isPublic) return true

      const req = context.switchToHttp().getRequest<Request>()
      if (req.cookies[env.JWT_COOKIE_NAME] !== jwtToken) {
        throw new UnauthorizedException()
      }

      req.user = { id: user.id }
      return true
    }
  }

  const csrfMiddleware: DoubleCsrfProtection = (req, res, next) => {
    req.csrfToken = () => csrfToken

    if (req.method !== 'GET' && req.path !== '/auth/signin') {
      const cookieToken = req.cookies[env.CSRF_COOKIE_NAME] as
        | string
        | undefined
      const headerToken = req.headers['x-csrf-token']

      if (!cookieToken || cookieToken !== headerToken) {
        throw new UnauthorizedException('CSRF token mismatch')
      }
    }

    res.cookie(env.CSRF_COOKIE_NAME, csrfToken)
    next()
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          validate: (config) => envSchema.parse(config),
        }),
        AuthModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: TestAuthGuard }],
    })
      .overrideProvider(USER_REPOSITORY)
      .useClass(UserRepositoryInMemory)
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .overrideProvider(JwtService)
      .useValue({ signAsync: jest.fn().mockResolvedValue(jwtToken) })
      .compile()

    app = moduleRef.createNestApplication()
    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe())
    app.use(csrfMiddleware)

    repository = moduleRef.get(USER_REPOSITORY)
    await repository.create(user)
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('signs in, reads the session and signs out through HTTP', async () => {
    const agent = request.agent(app.getHttpServer())

    const signin = await agent.post('/auth/signin').send({
      email: user.email,
      password: user.password,
    })

    expect(signin.status).toBe(200)
    expect(signin.body).toMatchObject({
      message: 'Signed in successfully',
      data: { csrfToken },
    })

    const session = await agent.get('/auth/me')

    expect(session.status).toBe(200)
    expect(session.body).toMatchObject({
      message: 'Authenticated',
      data: { user: { id: user.id }, csrfToken },
    })

    const logout = await agent
      .post('/auth/logout')
      .set('x-csrf-token', csrfToken)

    expect(logout.status).toBe(200)
    expect(logout.body).toMatchObject({ message: 'Signed out successfully' })
  })

  it('returns 400 when signin data is invalid', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'invalid-email', password: '' })
      .expect(400)
  })

  it('returns 401 for invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: user.email, password: 'wrong-password' })
      .expect(401)
  })

  it('returns 401 when a protected endpoint has no JWT cookie', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401)
  })
})
