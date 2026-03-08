import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './post.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get comments' })
  @ApiQuery({ name: 'postId', required: false, type: Number })
  @SwaggerApiResponse({ status: 200, description: 'List of comments' })
  async getAll(@Query('postId') postId?: string): Promise<ApiResponse<CommentEntity[]>> {
    const pid = postId ? Number(postId) : undefined;
    const data = await this.service.findAll(pid);
    return { success: true, message: 'OK', data };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get comments by user id' })
  @SwaggerApiResponse({ status: 200, description: 'List of comments by user' })
  async getByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<ApiResponse<CommentEntity[]>> {
    const data = await this.service.findByUserId(userId);
    return { success: true, message: 'OK', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @SwaggerApiResponse({ status: 200, description: 'Comment' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<CommentEntity>> {
    const data = await this.service.findOne(id);
    return { success: true, message: 'OK', data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a comment' })
  @SwaggerApiResponse({ status: 201, description: 'Created' })
  async create(@Body() dto: CreateCommentDto): Promise<ApiResponse<CommentEntity>> {
    const data = await this.service.create(dto);
    return { success: true, message: 'Created', data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @SwaggerApiResponse({ status: 200, description: 'Updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto): Promise<ApiResponse<CommentEntity>> {
    const data = await this.service.update(id, dto);
    return { success: true, message: 'Updated', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @SwaggerApiResponse({ status: 200, description: 'Deleted' })
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<CommentEntity>> {
    const data = await this.service.remove(id);
    return { success: true, message: 'Deleted', data };
  }
}