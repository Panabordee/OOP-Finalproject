import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @SwaggerApiResponse({ status: 200, description: 'List of users' })
  async getAll(): Promise<ApiResponse<UserEntity[]>> {
    const data = await this.service.findAll();
    return { success: true, message: 'OK', data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @SwaggerApiResponse({ status: 200, description: 'User' })
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<UserEntity>> {
    const data = await this.service.findOne(id);
    return { success: true, message: 'OK', data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @SwaggerApiResponse({ status: 201, description: 'Created' })
  async create(@Body() dto: CreateUserDto): Promise<ApiResponse<UserEntity>> {
    const data = await this.service.create(dto);
    return { success: true, message: 'Created', data };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @SwaggerApiResponse({ status: 200, description: 'Updated' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<ApiResponse<UserEntity>> {
    const data = await this.service.update(id, dto);
    return { success: true, message: 'Updated', data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @SwaggerApiResponse({ status: 200, description: 'Deleted' })
  @HttpCode(200)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<UserEntity>> {
    const data = await this.service.remove(id);
    return { success: true, message: 'Deleted', data };
  }
}
