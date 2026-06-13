import { ContactDto } from '../../dtos/contact.dto'
import { EducationDto } from '../../dtos/education.dto'
import { ExperienceDto } from '../../dtos/experience.dto'
import { ProfileDto } from '../../dtos/profile.dto'

const createProfileFixture = (profile?: ProfileDto) => {
  const profileDto = new ProfileDto()

  profileDto.name = profile?.name || 'Profile Name'
  profileDto.role = profile?.role || 'Profile Role'
  profileDto.profileId = profile?.profileId || 'default'
  profileDto.imageUrl = profile?.imageUrl || 'https://example.com/image.jpg'
  profileDto.bio = profile?.bio || 'Profile Bio'
  profileDto.skills = profile?.skills || ['Skill 1']

  const contactDto = new ContactDto()
  contactDto.location = profile?.contact?.location || 'Profile Location'
  contactDto.linkedin = profile?.contact?.linkedin || 'Profile LinkedIn'
  contactDto.github = profile?.contact?.github || 'Profile GitHub'
  profileDto.contact = contactDto

  const experienceDto = new ExperienceDto()
  experienceDto.company = 'Company Name'
  experienceDto.role = 'Experience Role'
  experienceDto.startDate = new Date(
    '2024-07-22',
  ).toISOString() as unknown as Date
  experienceDto.endDate = new Date(
    '2026-06-13',
  ).toISOString() as unknown as Date
  experienceDto.description = 'Experience Description'
  experienceDto.tags = ['Tag 1']
  profileDto.experiences = profile?.experiences || [experienceDto]

  const educationDto = new EducationDto()
  educationDto.title = 'Education Title'
  educationDto.institution = 'Education Institution'
  educationDto.startDate = new Date(
    '2012-01-01',
  ).toISOString() as unknown as Date
  educationDto.endDate = new Date('2018-01-01').toISOString() as unknown as Date
  educationDto.description = 'Education Description'
  educationDto.tags = ['Tag 1']
  educationDto.certificateUrl = 'https://example.com/certificate.pdf'
  educationDto.degree = 'Degree'
  profileDto.education = profile?.education || [educationDto]

  return profileDto
}

export { createProfileFixture }
