import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcrypt'

import { SigninDto } from '../dtos/signin.dto'
import { UserRepository } from '../repositories/user-repository'
import { JwtPayload } from '../types/jwt.types'

@Injectable()
export class SigninService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(signinDto: SigninDto) {
    const user = await this.userRepository.findByEmail(signinDto.email)
    if (!user) {
      throw new UnauthorizedException()
    }

    const passwordMatches = await bcrypt.compare(
      signinDto.password,
      user.password,
    )

    if (!passwordMatches) {
      throw new UnauthorizedException()
    }

    const payload: JwtPayload = {
      sub: user.id,
    }

    const accessToken = await this.jwtService.signAsync(payload)

    return { accessToken }
  }
}
