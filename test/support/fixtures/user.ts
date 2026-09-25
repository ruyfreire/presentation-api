import { User } from 'src/modules/auth/entities'

export function createUserFixture(user: Partial<User> = {}) {
  const fixture = new User()
  fixture.id = user.id ?? 'user-id'
  fixture.email = user.email ?? 'user@example.com'
  fixture.password = user.password ?? 'password-mock'

  return fixture
}
