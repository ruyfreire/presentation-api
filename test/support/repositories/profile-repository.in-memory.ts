import { randomUUID } from 'node:crypto'

import { Profile } from 'src/modules/profile/entities'
import { IProfileRepository } from 'src/modules/profile/repositories/profile-repository.interface'

export class ProfileRepositoryInMemory implements IProfileRepository {
  profiles: Profile[] = []

  async getProfile(profileId: string) {
    return await Promise.resolve(
      this.profiles
        .filter((profile) => profile.profileId === profileId)
        .sort((a, b) => b.version - a.version)[0] ?? null,
    )
  }

  async createProfile(profile: Profile) {
    const profileVersions = this.profiles
      .filter((item) => item.profileId === profile.profileId)
      .map((item) => item.version)
    const lastVersion =
      profileVersions.length > 0 ? Math.max(...profileVersions) : 0

    const profileToSave = this.addIdToDeepObject({
      ...profile,
      version: lastVersion + 1,
    })

    this.profiles.unshift(profileToSave)
    return await Promise.resolve(profileToSave)
  }

  private addIdToDeepObject<T>(object: T): T {
    if (
      typeof object !== 'object' ||
      object === null ||
      Array.isArray(object)
    ) {
      return object
    }

    const result = object as Record<string, unknown>

    if ('id' in result) {
      result.id = result.id || randomUUID()
    }

    for (const key in object) {
      if (Array.isArray(object[key])) {
        result[key] = object[key].map((item: Record<string, unknown>) =>
          this.addIdToDeepObject(item),
        )
      } else if (typeof object[key] === 'object') {
        result[key] = this.addIdToDeepObject(
          object[key] as Record<string, unknown>,
        )
      }
    }

    return result as T
  }
}
