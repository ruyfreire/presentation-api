import { Inject, Injectable } from '@nestjs/common'

import {
  type IUserRepository,
  USER_REPOSITORY,
} from './user-repository.interface'

@Injectable()
export class UserRepository {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: IUserRepository,
  ) {}

  async findByEmail(email: string) {
    return this.repository.findByEmail(email)
  }
}
