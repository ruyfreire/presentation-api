import { User } from '../entities'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
}

export const USER_REPOSITORY = Symbol('IUserRepository')
