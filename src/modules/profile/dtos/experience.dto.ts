import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class ExperienceDto {
  @ApiProperty({
    description: 'The company of the experience',
    example: 'Example Inc.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  company: string

  @ApiProperty({
    description: 'The role of the experience',
    example: 'Software Engineer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  role: string

  @ApiProperty({
    description: 'The start date of the experience',
    example: '2020-01-01',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date

  @ApiProperty({
    description: 'The end date of the experience',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate: Date | null

  @ApiProperty({
    description: 'The description of the experience',
    example: 'I worked as a software engineer at Example Inc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string | null

  @ApiProperty({
    description: 'The tags of the experience',
    example: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags: string[] | null
}
