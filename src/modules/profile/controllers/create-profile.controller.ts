import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger'

import { ProfileDtoMapper } from '../dtos/mapper'
import { ProfileDto } from '../dtos/profile.dto'
import { Profile } from '../entities'
import { CreateProfileService } from '../services/create-profile.service'

@Controller('profile')
@ApiTags('Profile')
@ApiExtraModels(Profile)
export class CreateProfileController {
  constructor(private readonly createProfileService: CreateProfileService) {}

  @ApiOperation({ summary: 'Create a new profile [Protected]' })
  @ApiCreatedResponse({
    description: 'Profile created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Profile created successfully',
        },
        data: {
          $ref: getSchemaPath(Profile),
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('')
  createProfile(@Body() profile: ProfileDto) {
    return this.createProfileService.execute(ProfileDtoMapper.toDomain(profile))
  }
}
