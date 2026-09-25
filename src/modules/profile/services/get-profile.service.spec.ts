import { NotFoundException } from '@nestjs/common'

import { Profile } from '../entities'
import { ProfileRepository } from '../repositories/profile-repository'
import { GetProfileService } from './get-profile.service'

describe('GetProfileService', () => {
  const getProfileMock = jest.fn()
  const createProfileMock = jest.fn()
  let service: GetProfileService

  beforeEach(() => {
    jest.clearAllMocks()

    service = new GetProfileService(
      new ProfileRepository({
        getProfile: getProfileMock,
        createProfile: createProfileMock,
      }),
    )
  })

  it('returns a profile by profileId', async () => {
    const profile = new Profile()
    profile.profileId = 'default'

    getProfileMock.mockResolvedValue(profile)

    const result = await service.execute(profile.profileId)

    expect(result).toEqual({
      message: 'Profile fetched successfully',
      data: profile,
    })

    expect(getProfileMock).toHaveBeenCalledWith(profile.profileId)
  })

  it('throws when the profile does not exist', async () => {
    getProfileMock.mockResolvedValue(null)

    const profileId = 'unknown'

    try {
      await service.execute(profileId)
    } catch (error) {
      expect(error).toEqual(
        new NotFoundException(
          `Profile not found with profileId '${profileId}'`,
        ),
      )
    }
  })
})
