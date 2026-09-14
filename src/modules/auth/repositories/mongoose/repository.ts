import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from '../../entities'
import { IUserRepository } from '../user-repository.interface'
import { UserMapper } from './mapper'
import { UserDocument } from './schema'

@Injectable()
export class UserMongooseRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string) {
    const rawUser = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec()

    if (!rawUser) return null

    return UserMapper.toDomain(rawUser)
  }
}
