import { ContactDto } from 'src/modules/profile/dtos/contact.dto'
import { EducationDto } from 'src/modules/profile/dtos/education.dto'
import { ExperienceDto } from 'src/modules/profile/dtos/experience.dto'
import { ProfileDto } from 'src/modules/profile/dtos/profile.dto'

export function createProfileFixture(profile: Partial<ProfileDto> = {}) {
  const contact = new ContactDto()
  contact.location = profile.contact?.location ?? 'Profile Location'
  contact.linkedin = profile.contact?.linkedin ?? 'Profile LinkedIn'
  contact.github = profile.contact?.github ?? 'Profile GitHub'

  const experience = new ExperienceDto()
  experience.company = 'Company Name'
  experience.role = 'Experience Role'
  experience.startDate = new Date('2024-07-22').toISOString() as unknown as Date
  experience.endDate = new Date('2026-06-13').toISOString() as unknown as Date
  experience.description = 'Experience Description'
  experience.tags = ['Tag 1']

  const education = new EducationDto()
  education.title = 'Education Title'
  education.institution = 'Education Institution'
  education.startDate = new Date('2012-01-01').toISOString() as unknown as Date
  education.endDate = new Date('2018-01-01').toISOString() as unknown as Date
  education.description = 'Education Description'
  education.tags = ['Tag 1']
  education.certificateUrl = 'https://example.com/certificate.pdf'
  education.degree = 'Degree'

  const fixture = new ProfileDto()
  fixture.name = profile.name ?? 'Profile Name'
  fixture.role = profile.role ?? 'Profile Role'
  fixture.profileId = profile.profileId ?? 'default'
  fixture.imageUrl = profile.imageUrl ?? 'https://example.com/image.jpg'
  fixture.bio = profile.bio ?? 'Profile Bio'
  fixture.skills = profile.skills ?? ['Skill 1']
  fixture.contact = profile.contact ?? contact
  fixture.experiences = profile.experiences ?? [experience]
  fixture.education = profile.education ?? [education]

  return fixture
}
