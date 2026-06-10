import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class ExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string

  @IsString()
  @IsNotEmpty()
  role: string

  @IsDateString()
  @IsNotEmpty()
  startDate: Date

  @IsDateString()
  @IsOptional()
  endDate: Date | null

  @IsString()
  @IsOptional()
  description: string | null

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags: string[] | null
}
