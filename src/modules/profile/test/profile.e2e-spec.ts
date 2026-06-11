import { INestApplication } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { App } from 'supertest/types'

import { Profile, ProfileVersionCounter } from '../entities'
import { ProfileModule } from '../profile.module'
import { PROFILE_REPOSITORY } from '../repositories/profile-repository.interface'
import { ProfileRepositoryInMemory } from './database/profile-repository.in-memory'
import { createProfileFixture } from './fixtures/profile'

describe('Profile Module (e2e)', () => {
  let app: INestApplication<App>
  let inMemoryRepository: ProfileRepositoryInMemory

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProfileModule],
    })
      .overrideProvider(PROFILE_REPOSITORY)
      .useClass(ProfileRepositoryInMemory)
      .overrideProvider(getModelToken(Profile.name))
      .useValue({})
      .overrideProvider(getModelToken(ProfileVersionCounter.name))
      .useValue({})
      .compile()

    app = moduleFixture.createNestApplication()

    inMemoryRepository =
      moduleFixture.get<ProfileRepositoryInMemory>(PROFILE_REPOSITORY)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('/profile (POST)', async () => {
    const profile = createProfileFixture()

    const response = await request(app.getHttpServer())
      .post('/profile')
      .send(profile)

    expect(response.status).toBe(201)
    expect(inMemoryRepository.profiles[0]).toMatchObject(profile)
  })

  it('/profile (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/profile')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      data: inMemoryRepository.profiles[0],
    })
  })
})
