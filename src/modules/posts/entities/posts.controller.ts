import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostEntity } from './entities/post.entity';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly service: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @SwaggerApiResponse({ status: 200, description: 'List of posts' })
  async getAll(): Promise<ApiResponse<PostEntity[]>> {
    const data = await this.service.findAll();
    return { success: true, message: 'OK', data };
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user id' })
  @SwaggerApiResponse({ status: 200, description: 'List of posts by user' })
  async getByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<ApiResponse<PostEntity[]>> {
    const data = await this.service.findByUserId(userId);
    return { success: true, message: 'OK', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by id' })
  @SwaggerApiResponse({ status: 200, description: 'Post' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<PostEntity>> {
    const data = await this.service.findOne(id);
    return { success: true, message: 'OK', data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a post' })
  @SwaggerApiResponse({ status: 201, description: 'Created' })
  async create(@Body() dto: CreatePostDto): Promise<ApiResponse<PostEntity>> {
    const data = await this.service.create(dto);
    return { success: true, message: 'Created', data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @SwaggerApiResponse({ status: 200, description: 'Updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto): Promise<ApiResponse<PostEntity>> {
    const data = await this.service.update(id, dto);
    return { success: true, message: 'Updated', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @SwaggerApiResponse({ status: 200, description: 'Deleted' })
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<PostEntity>> {
    const data = await this.service.remove(id);
    return { success: true, message: 'Deleted', data };
  }
}