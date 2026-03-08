import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  postId!: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 'Nice post!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content!: string;
}

export class UpdateCommentDto extends PartialType(OmitType(CreateCommentDto, ['userId', 'postId'] as const)) {}
