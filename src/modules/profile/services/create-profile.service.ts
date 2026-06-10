import { Injectable } from '@nestjs/common'

import { Profile } from '../entities'
import { ProfileRepository } from '../repositories/profile-repository'

@Injectable()
export class CreateProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(profile: Profile) {
    const createdProfile = await this.profileRepository.createProfile(profile)

    return {
      message: 'Profile created successfully',
      data: createdProfile,
    }
  }
}
