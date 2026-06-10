import { Contact, Education, Experience, Profile } from '../entities'
import { ProfileDto } from './profile.dto'

export class ProfileDtoMapper {
  static toDomain(raw: ProfileDto): Profile {
    const profile = new Profile()

    profile.profileId = raw.profileId || 'default'
    profile.name = raw.name
    profile.role = raw.role
    profile.bio = raw.bio
    profile.skills = raw.skills

    const contact = new Contact()
    contact.location = raw.contact.location
    contact.linkedin = raw.contact.linkedin
    contact.github = raw.contact.github

    profile.contact = contact

    profile.experiences = raw.experiences.map((experience) => {
      const exp = new Experience()
      exp.company = experience.company
      exp.role = experience.role
      exp.startDate = experience.startDate
      exp.endDate = experience.endDate
      exp.description = experience.description
      exp.tags = experience.tags
      return exp
    })

    profile.education = raw.education.map((education) => {
      const edu = new Education()
      edu.title = education.title
      edu.institution = education.institution
      edu.degree = education.degree
      edu.startDate = education.startDate
      edu.endDate = education.endDate
      edu.certificateUrl = education.certificateUrl
      edu.description = education.description
      edu.tags = education.tags
      return edu
    })

    return profile
  }
}
