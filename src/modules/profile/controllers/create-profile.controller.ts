import { Body, Controller, Post } from '@nestjs/common'

import { ProfileDtoMapper } from '../dtos/mapper'
import { ProfileDto } from '../dtos/profile.dto'
import { CreateProfileService } from '../services/create-profile.service'

@Controller('profile')
export class CreateProfileController {
  constructor(private readonly createProfileService: CreateProfileService) {}

  @Post('')
  createProfile(@Body() profile: ProfileDto) {
    return this.createProfileService.execute(ProfileDtoMapper.toDomain(profile))
  }
}
