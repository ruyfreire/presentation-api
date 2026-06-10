import { Profile } from '../entities'

export interface IProfileRepository {
  getProfile(profileId: string): Promise<Profile | null>
  createProfile(profile: Profile): Promise<Profile>
}

export const PROFILE_REPOSITORY = Symbol('IProfileRepository')
