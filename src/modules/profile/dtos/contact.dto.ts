import { IsNotEmpty, IsString } from 'class-validator'

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  location: string

  @IsString()
  @IsNotEmpty()
  linkedin: string

  @IsString()
  @IsNotEmpty()
  github: string
}
