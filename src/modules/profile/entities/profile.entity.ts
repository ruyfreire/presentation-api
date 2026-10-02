import { Contact } from './contact.entity'
import { Education } from './education.entity'
import { Experience } from './experience.entity'

export class Profile {
  id: string
  profileId: string
  imageUrl: string | null
  name: string
  role: string
  bio: string | null
  contact: Contact
  skills: string[] | null
  experiences: Experience[]
  education: Education[]
  createdAt: Date
  updatedAt: Date
}
