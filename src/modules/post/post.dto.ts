import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'เนื้อหาคอมเมนต์ที่น่าสนใจ' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text!: string;

  @ApiProperty({ example: 'ชื่อผู้เขียน' })
  @IsString()
  @IsNotEmpty()
  author!: string;
}