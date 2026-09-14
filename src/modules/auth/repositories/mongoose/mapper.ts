import { User } from '../../entities'
import { UserDocument } from './schema'

export class UserMapper {
  static toDomain(raw: UserDocument): User {
    const domainUser = new User()

    domainUser.id = raw.id.toString()
    domainUser.email = raw.email
    domainUser.password = raw.password

    return domainUser
  }
}
