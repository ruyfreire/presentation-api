import { Body, Controller, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'

import { ProfileDtoMapper } from '../dtos/mapper'
import { ProfileDto } from '../dtos/profile.dto'
import { CreateProfileService } from '../services/create-profile.service'

@Controller('profile')
@ApiTags('Profile')
export class CreateProfileController {
  constructor(private readonly createProfileService: CreateProfileService) {}

  @ApiOperation({
    summary: 'Create a new profile [Protected]',
    security: [{ bearer: [] }],
  })
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
          $ref: getSchemaPath(ProfileDto),
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('')
  createProfile(@Body() profile: ProfileDto) {
    return this.createProfileService.execute(ProfileDtoMapper.toDomain(profile))
  }
}
