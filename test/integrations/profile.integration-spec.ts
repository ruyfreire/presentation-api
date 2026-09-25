import { INestApplication, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import { Profile, ProfileVersionCounter } from 'src/modules/profile/entities'
import { ProfileModule } from 'src/modules/profile/profile.module'
import { PROFILE_REPOSITORY } from 'src/modules/profile/repositories/profile-repository.interface'
import request from 'supertest'
import type { App } from 'supertest/types'

import { createProfileFixture } from '../support/fixtures/profile'
import { ProfileRepositoryInMemory } from '../support/repositories/profile-repository.in-memory'

describe('Profile HTTP integration', () => {
  let app: INestApplication<App>
  let repository: ProfileRepositoryInMemory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProfileModule],
    })
      .overrideProvider(PROFILE_REPOSITORY)
      .useClass(ProfileRepositoryInMemory)
      .overrideProvider(getModelToken(Profile.name))
      .useValue({})
      .overrideProvider(getModelToken(ProfileVersionCounter.name))
      .useValue({})
      .compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

    repository = moduleRef.get(PROFILE_REPOSITORY)
    await app.init()
  })

  afterEach(() => {
    repository.profiles = []
  })

  afterAll(async () => {
    await app.close()
  })

  it('creates and reads a profile through HTTP', async () => {
    const profile = createProfileFixture()

    const created = await request(app.getHttpServer())
      .post('/profile')
      .send(profile)

    expect(created.status).toBe(201)
    expect(created.body).toMatchObject({
      message: 'Profile created successfully',
      data: { profileId: profile.profileId, version: 1 },
    })

    const fetched = await request(app.getHttpServer())
      .get('/profile')
      .query({ profileId: profile.profileId })

    expect(fetched.status).toBe(200)
    expect(fetched.body).toMatchObject({
      message: 'Profile fetched successfully',
      data: { profileId: profile.profileId, version: 1 },
    })
  })

  it('returns 400 when profile data is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/profile')
      .send(createProfileFixture({ name: '' }))

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: expect.arrayContaining(['name should not be empty']) as string[],
    })
  })

  it('returns 404 when the profile does not exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/profile')
      .query({ profileId: 'unknown' })

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      message: "Profile not found with profileId 'unknown'",
    })
  })
})
