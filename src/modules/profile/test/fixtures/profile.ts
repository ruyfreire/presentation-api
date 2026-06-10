import { ContactDto } from '../../dtos/contact.dto'
import { EducationDto } from '../../dtos/education.dto'
import { ExperienceDto } from '../../dtos/experience.dto'
import { ProfileDto } from '../../dtos/profile.dto'

const createProfileFixture = (profile?: ProfileDto) => {
  const profileDto = new ProfileDto()

  profileDto.name = profile?.name || 'Profile Name'
  profileDto.role = profile?.role || 'Profile Role'
  profileDto.profileId = profile?.profileId || 'default'

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
  profileDto.experiences = profile?.experiences || [experienceDto]

  const educationDto = new EducationDto()
  educationDto.title = 'Education Title'
  educationDto.institution = 'Education Institution'
  educationDto.startDate = new Date(
    '2012-01-01',
  ).toISOString() as unknown as Date
  profileDto.education = profile?.education || [educationDto]

  return JSON.parse(JSON.stringify(profileDto)) as ProfileDto
}

export { createProfileFixture }
