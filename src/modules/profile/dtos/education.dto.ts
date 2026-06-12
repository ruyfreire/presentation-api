import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class EducationDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  institution: string

  @IsString()
  @IsOptional()
  degree: string | null

  @IsDateString()
  @IsNotEmpty()
  startDate: Date

  @IsDateString()
  @IsOptional()
  endDate: Date | null

  @IsString()
  @IsOptional()
  certificateUrl: string | null

  @IsString()
  @IsOptional()
  description: string | null

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags: string[] | null
}
