import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'

import { User } from '../entities'
import { UserRepository } from '../repositories/user-repository'
import { SigninService } from './signin.service'

describe('SigninService', () => {
  let service: SigninService

  const findByEmailMock = jest.fn()

  const userRepository = new UserRepository({
    findByEmail: findByEmailMock,
  })

  const signAsyncMock = jest.fn()
  const jwtService = {
    signAsync: signAsyncMock,
  } as unknown as JwtService

  beforeEach(() => {
    jest.clearAllMocks()

    service = new SigninService(userRepository, jwtService)
  })

  it('returns an access token for valid credentials', async () => {
    const user: User = {
      id: 'user-id',
      email: 'user@example.com',
      password: await bcrypt.hash('valid-password', 4),
    }

    const accessTokenMock = 'access-token'

    findByEmailMock.mockResolvedValue(user)
    signAsyncMock.mockResolvedValue(accessTokenMock)

    const result = await service.execute({
      email: user.email,
      password: 'valid-password',
    })

    expect(result).toEqual({ accessToken: accessTokenMock })

    expect(findByEmailMock).toHaveBeenCalledWith(user.email)
    expect(signAsyncMock).toHaveBeenCalledWith({ sub: user.id })
  })

  it('rejects an unknown user', async () => {
    findByEmailMock.mockResolvedValue(null)

    try {
      await service.execute({
        email: 'unknown@example.com',
        password: 'password',
      })
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }

    expect(signAsyncMock).not.toHaveBeenCalled()
  })

  it('rejects an invalid password', async () => {
    const user: User = {
      id: 'user-id',
      email: 'user@example.com',
      password: await bcrypt.hash('valid-password', 4),
    }

    findByEmailMock.mockResolvedValue(user)

    try {
      await service.execute({
        email: user.email,
        password: 'invalid-password',
      })
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException)
    }

    expect(signAsyncMock).not.toHaveBeenCalled()
  })
})
