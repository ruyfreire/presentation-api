import { Profile } from 'src/modules/profile/entities'
import { IProfileRepository } from 'src/modules/profile/repositories/profile-repository.interface'

export class ProfileRepositoryInMemory implements IProfileRepository {
  profiles: Profile[] = []

  async getProfile(profileId: string) {
    const filtered = this.profiles
      .filter((profile) => profile.profileId === profileId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return await Promise.resolve(filtered[0] ?? null)
  }

  async createProfile(profile: Profile) {
    profile.createdAt = new Date()
    this.profiles.unshift(profile)
    return await Promise.resolve(profile)
  }
}
