import { Profile } from '../../entities'
import { IProfileRepository } from '../../repositories/profile-repository.interface'

export class ProfileRepositoryInMemory implements IProfileRepository {
  profiles: Profile[] = []

  async getProfile(profileId: string) {
    return await Promise.resolve(
      this.profiles
        .filter((profile) => profile.profileId === profileId)
        .sort((a, b) => b.version - a.version)[0] || null,
    )
  }

  async createProfile(profile: Profile) {
    const lastVersion =
      this.profiles.length > 0
        ? Math.max(...this.profiles.map((profile) => profile.version))
        : 0

    profile.version = lastVersion + 1

    const profileToSave = JSON.parse(JSON.stringify(profile)) as Profile

    this.profiles.unshift(profileToSave)
    return await Promise.resolve(profileToSave)
  }
}
