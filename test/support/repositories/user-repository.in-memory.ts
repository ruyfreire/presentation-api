import bcrypt from 'bcrypt'
import { User } from 'src/modules/auth/entities'
import { IUserRepository } from 'src/modules/auth/repositories/user-repository.interface'

export class UserRepositoryInMemory implements IUserRepository {
  users: User[] = []

  async create(user: User) {
    const password = await bcrypt.hash(user.password, 4)
    this.users.push({ ...user, password })
  }

  async findByEmail(email: string) {
    return await Promise.resolve(
      this.users.find((user) => user.email === email) ?? null,
    )
  }
}
