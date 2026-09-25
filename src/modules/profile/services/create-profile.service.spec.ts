import { Profile } from '../entities'
import { ProfileRepository } from '../repositories/profile-repository'
import { CreateProfileService } from './create-profile.service'

describe('CreateProfileService', () => {
  const createProfileMock = jest.fn()
  const getProfileMock = jest.fn()

  let service: CreateProfileService

  beforeEach(() => {
    jest.clearAllMocks()

    service = new CreateProfileService(
      new ProfileRepository({
        createProfile: createProfileMock,
        getProfile: getProfileMock,
      }),
    )
  })

  it('creates and returns a profile', async () => {
    const profile = new Profile()
    profile.profileId = 'default'
    profile.name = 'Ruy'

    const createdProfile = { ...profile, id: 'profile-id', version: 1 }
    createProfileMock.mockResolvedValue(createdProfile)

    const result = await service.execute(profile)

    expect(result).toEqual({
      message: 'Profile created successfully',
      data: createdProfile,
    })

    expect(createProfileMock).toHaveBeenCalledWith(profile)
  })
})
