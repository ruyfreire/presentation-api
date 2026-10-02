import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Profile } from '../../entities'
import { IProfileRepository } from '../profile-repository.interface'
import { ProfileMapper } from './mapper'
import { ProfileDocument } from './schema'

@Injectable()
export class ProfileMongooseRepository implements IProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  async getProfile(profileId: string) {
    const rawProfile = await this.profileModel
      .findOne({ profileId })
      .sort({ createdAt: -1 })
      .exec()

    if (!rawProfile) return null

    return ProfileMapper.toDomain(rawProfile)
  }

  async createProfile(profile: Profile) {
    const saved = await this.profileModel.create(profile)

    return ProfileMapper.toDomain(saved)
  }
}
