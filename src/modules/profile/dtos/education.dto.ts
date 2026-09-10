import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class EducationDto {
  @ApiProperty({
    description: 'The title of the education',
    example: 'Bachelor of Science',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({
    description: 'The institution of the education',
    example: 'Example University',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  institution: string

  @ApiProperty({
    description: 'The degree of the education',
    example: 'Bachelor of Science',
    required: false,
  })
  @IsString()
  @IsOptional()
  degree: string | null

  @ApiProperty({
    description: 'The start date of the education',
    example: '2020-01-01',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date

  @ApiProperty({
    description: 'The end date of the education',
    example: '2024-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate: Date | null

  @ApiProperty({
    description: 'The certificate URL of the education',
    example: 'https://example.com/certificate.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  certificateUrl: string | null

  @ApiProperty({
    description: 'The description of the education',
    example: 'I studied at Example University',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string | null

  @ApiProperty({
    description: 'The tags of the education',
    example: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags: string[] | null
}
