import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateCommentDto } from './create-comment.dto'; // เช็ค path ให้ถูก
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post(':id/comments')
  @ApiOperation({ summary: 'เพิ่มคอมเมนต์ใหม่ลงในโพสต์' })
  createComment(
    @Param('id', ParseIntPipe) id: number, 
    @Body() createCommentDto: CreateCommentDto
  ) {
    return this.postsService.addComment(id, createCommentDto);
  }
}