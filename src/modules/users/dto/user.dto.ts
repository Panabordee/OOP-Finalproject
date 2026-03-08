import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'alice_smith', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username!: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['username', 'email'] as const)) {}
