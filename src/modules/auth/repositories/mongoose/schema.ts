import { Document, Schema } from 'mongoose'

import { User } from '../../entities'

export type UserDocument = User & Document

export const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'users',
  },
)
