import { Contact, Education, Experience, Profile } from '../../entities'
import { ProfileDocument } from './schema'

export class ProfileMapper {
  static toDomain(raw: ProfileDocument): Profile {
    const domainProfile = new Profile()

    domainProfile.id = raw.id.toString()
    domainProfile.profileId = raw.profileId
    domainProfile.version = raw.version
    domainProfile.name = raw.name
    domainProfile.role = raw.role
    domainProfile.bio = raw.bio
    domainProfile.imageUrl = raw.imageUrl
    domainProfile.skills = raw.skills

    const contact = new Contact()
    contact.location = raw.contact.location
    contact.linkedin = raw.contact.linkedin
    contact.github = raw.contact.github
    domainProfile.contact = contact

    domainProfile.experiences = raw.experiences.map((exp) => {
      const entity = new Experience()
      entity.id = exp.id
      entity.company = exp.company
      entity.role = exp.role
      entity.startDate = exp.startDate
      entity.endDate = exp.endDate
      entity.description = exp.description
      entity.tags = exp.tags
      return entity
    })

    domainProfile.education = raw.education.map((edu) => {
      const entity = new Education()
      entity.id = edu.id
      entity.title = edu.title
      entity.institution = edu.institution
      entity.degree = edu.degree
      entity.startDate = edu.startDate
      entity.endDate = edu.endDate
      entity.certificateUrl = edu.certificateUrl
      entity.description = edu.description
      entity.tags = edu.tags
      return entity
    })

    return domainProfile
  }
}
