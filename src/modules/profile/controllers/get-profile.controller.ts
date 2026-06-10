import { Controller, Get, Query } from '@nestjs/common'

import { GetProfileService } from '../services/get-profile.service'

@Controller('profile')
export class GetProfileController {
  constructor(private readonly getProfileService: GetProfileService) {}

  @Get('')
  getProfile(@Query('profileId') profileId: string) {
    return this.getProfileService.execute(profileId ?? 'default')
  }
}
