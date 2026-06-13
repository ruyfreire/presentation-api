import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'

import { ContactDto } from './contact.dto'
import { EducationDto } from './education.dto'
import { ExperienceDto } from './experience.dto'

export class ProfileDto {
  @IsString()
  @IsOptional()
  profileId: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  role: string

  @IsString()
  @IsOptional()
  bio: string | null

  @IsString()
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  imageUrl: string | null

  @ValidateNested()
  contact: ContactDto

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills: string[] | null

  @ValidateNested()
  experiences: ExperienceDto[]

  @ValidateNested()
  education: EducationDto[]
}
