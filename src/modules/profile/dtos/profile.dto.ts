import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty({
    description: 'The ID of the profile',
    example: 'profile1',
    required: false,
    default: 'default',
  })
  @IsString()
  @IsOptional()
  profileId: string

  @ApiProperty({
    description: 'The name of the profile',
    example: 'John Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The role of the profile',
    example: 'Software Engineer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  role: string

  @ApiProperty({
    type: String,
    description: 'The bio of the profile',
    example: 'I am a software engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio: string | null

  @ApiProperty({
    description: 'The image URL of the profile',
    example: 'https://example.com/image.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsUrl({ protocols: ['https'], require_protocol: true })
  imageUrl: string | null

  @ApiProperty({
    description: 'The contact of the profile',
    type: ContactDto,
    required: true,
  })
  @ValidateNested()
  contact: ContactDto

  @ApiProperty({
    description: 'The skills of the profile',
    example: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills: string[] | null

  @ApiProperty({
    description: 'The experiences of the profile',
    type: [ExperienceDto],
    required: true,
  })
  @ValidateNested()
  experiences: ExperienceDto[]

  @ApiProperty({
    description: 'The education of the profile',
    type: [EducationDto],
    required: true,
  })
  @ValidateNested()
  education: EducationDto[]
}
