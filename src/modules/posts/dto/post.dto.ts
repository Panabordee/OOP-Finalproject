import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsInt, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PostStatus } from '../../../common/enums/post-status.enum';

export class CreatePostDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 'My First Post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title!: string;

  @ApiProperty({ example: 'This is the content of my post' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content!: string;

  @ApiProperty({ example: 'DRAFT', enum: PostStatus, required: false })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}

export class UpdatePostDto extends PartialType(OmitType(CreatePostDto, ['userId'] as const)) {}
