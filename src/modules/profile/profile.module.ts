import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { CreateProfileController, GetProfileController } from './controllers'
import { Profile, ProfileVersionCounter } from './entities'
import { ProfileMongooseRepository } from './repositories/mongoose/repository'
import {
  ProfileSchema,
  ProfileVersionCounterSchema,
} from './repositories/mongoose/schema'
import { ProfileRepository } from './repositories/profile-repository'
import { PROFILE_REPOSITORY } from './repositories/profile-repository.interface'
import { CreateProfileService, GetProfileService } from './services'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      {
        name: ProfileVersionCounter.name,
        schema: ProfileVersionCounterSchema,
      },
    ]),
  ],
  controllers: [GetProfileController, CreateProfileController],
  providers: [
    ProfileRepository,
    {
      provide: PROFILE_REPOSITORY,
      useClass: ProfileMongooseRepository,
    },
    GetProfileService,
    CreateProfileService,
  ],
})
export class ProfileModule {}
