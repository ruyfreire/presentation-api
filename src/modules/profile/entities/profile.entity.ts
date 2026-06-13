import { Contact } from './contact.entity'
import { Education } from './education.entity'
import { Experience } from './experience.entity'

export class Profile {
  id: string
  version: number
  profileId: string
  imageUrl: string | null
  name: string
  role: string
  bio: string | null
  contact: Contact
  skills: string[] | null
  experiences: Experience[]
  education: Education[]
}

export class ProfileVersionCounter {
  profileId: string
  version: number
}
