import { Inject, Injectable } from '@nestjs/common'

import { Profile } from '../entities'
import {
  type IProfileRepository,
  PROFILE_REPOSITORY,
} from './profile-repository.interface'

@Injectable()
export class ProfileRepository {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly repository: IProfileRepository,
  ) {}

  async getProfile(profileId: string) {
    return this.repository.getProfile(profileId)
  }

  async createProfile(profile: Profile) {
    return this.repository.createProfile(profile)
  }
}
