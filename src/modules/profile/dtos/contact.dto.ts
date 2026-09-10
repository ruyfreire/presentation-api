import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ContactDto {
  @ApiProperty({
    description: 'The location of the contact',
    example: 'São Paulo, Brazil',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  location: string

  @ApiProperty({
    description: 'The LinkedIn URL of the contact',
    example: 'https://www.linkedin.com/in/john-doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  linkedin: string

  @ApiProperty({
    description: 'The GitHub URL of the contact',
    example: 'https://github.com/john-doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  github: string
}
