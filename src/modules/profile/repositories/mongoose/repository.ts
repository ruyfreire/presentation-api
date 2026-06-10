import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { Profile, ProfileVersionCounter } from '../../entities'
import { IProfileRepository } from '../profile-repository.interface'
import { ProfileMapper } from './mapper'
import { ProfileDocument, ProfileVersionCounterDocument } from './schema'

@Injectable()
export class ProfileMongooseRepository implements IProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(ProfileVersionCounter.name)
    private readonly profileVersionCounterModel: Model<ProfileVersionCounterDocument>,
  ) {}

  async getProfile(profileId: string) {
    const rawProfile = await this.profileModel
      .findOne({ profileId })
      .sort({ version: -1 })
      .exec()

    if (!rawProfile) return null

    return ProfileMapper.toDomain(rawProfile)
  }

  async createProfile(profile: Profile) {
    const counter = await this.profileVersionCounterModel
      .findOneAndUpdate(
        { profileId: profile.profileId },
        { $inc: { version: 1 } },
        { upsert: true, returnDocument: 'after' },
      )
      .exec()

    const saved = await this.profileModel.create({
      ...profile,
      version: counter.version,
      profileId: profile.profileId,
    })

    return ProfileMapper.toDomain(saved)
  }
}
