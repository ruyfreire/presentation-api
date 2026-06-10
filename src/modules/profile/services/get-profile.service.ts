import { Injectable, NotFoundException } from '@nestjs/common'

import { ProfileRepository } from '../repositories/profile-repository'

@Injectable()
export class GetProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(profileId: string) {
    const profile = await this.profileRepository.getProfile(profileId)

    if (!profile) {
      throw new NotFoundException(
        `Profile not found with profileId '${profileId}'`,
      )
    }

    return {
      message: 'Profile fetched successfully',
      data: profile,
    }
  }
}
