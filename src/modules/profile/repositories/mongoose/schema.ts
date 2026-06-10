import { Document, Schema } from 'mongoose'

import {
  Contact,
  Education,
  Experience,
  Profile,
  ProfileVersionCounter,
} from '../../entities'

export type ProfileDocument = Profile & Document

const ContactSchema = new Schema<Contact>(
  {
    location: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
  },
  { _id: false },
)

const ExperienceSchema = new Schema<Experience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  description: { type: String, default: null },
  tags: [{ type: String, trim: true, default: null }],
})

const EducationSchema = new Schema<Education>({
  title: { type: String, required: true },
  institution: { type: String, required: true },
  degree: { type: String, default: null },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  certificateUrl: { type: String, default: null },
  description: { type: String, default: null },
  tags: [{ type: String, trim: true, default: null }],
})

export const ProfileSchema = new Schema<Profile>(
  {
    profileId: { type: String, required: true },
    version: { type: Number, required: true, default: 1 },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    bio: { type: String, default: null },
    contact: { type: ContactSchema, required: true },
    skills: [{ type: String, trim: true, default: null }],
    experiences: [ExperienceSchema],
    education: [EducationSchema],
  },
  {
    timestamps: true,
    collection: 'profiles',
  },
)

ProfileSchema.index({ profileId: 1, version: 1 }, { unique: true })

export type ProfileVersionCounterDocument = ProfileVersionCounter & Document

export const ProfileVersionCounterSchema = new Schema<ProfileVersionCounter>(
  {
    profileId: { type: String, required: true, unique: true },
    version: { type: Number, required: true, default: 0 },
  },
  {
    _id: false,
    collection: 'profile_version_counters',
  },
)
