import { randomUUID } from 'node:crypto'

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

    const profileToSave = this.addIdToDeepObject(profile)

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

    const newObject: Record<string, unknown> = object as Record<string, unknown>

    if ('id' in newObject) {
      newObject.id = newObject.id || randomUUID()
    }

    for (const key in object) {
      if (Array.isArray(object[key])) {
        newObject[key] = object[key].map((item: Record<string, unknown>) =>
          this.addIdToDeepObject(item),
        )
      } else if (typeof object[key] === 'object') {
        newObject[key] = this.addIdToDeepObject(
          object[key] as Record<string, unknown>,
        )
      } else {
        newObject[key] = object[key]
      }
    }

    return newObject as T
  }
}
