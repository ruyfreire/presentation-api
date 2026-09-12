import { Controller, Get, Query } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'

import { Public } from '../../auth/auth.decorators'
import { Profile } from '../entities'
import { GetProfileService } from '../services/get-profile.service'

@Controller('profile')
@ApiTags('Profile')
@ApiExtraModels(Profile)
export class GetProfileController {
  constructor(private readonly getProfileService: GetProfileService) {}

  @ApiOperation({ summary: 'Get a profile by ID' })
  @ApiOkResponse({
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Profile fetched successfully',
        },
        data: {
          $ref: getSchemaPath(Profile),
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: `Profile not found with profileId 'default'`,
  })
  @ApiQuery({
    name: 'profileId',
    required: false,
    description: 'The ID of the profile to get',
    default: 'default',
    type: String,
  })
  @Public()
  @Get('')
  getProfile(@Query('profileId') profileId?: string) {
    return this.getProfileService.execute(profileId ?? 'default')
  }
}
