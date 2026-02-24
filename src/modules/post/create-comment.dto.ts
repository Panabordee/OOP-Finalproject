import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a great post!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500) // กำหนดความยาวสูงสุดเพื่อป้องกันข้อความยาวเกินไป
  text!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  author!: string;
}