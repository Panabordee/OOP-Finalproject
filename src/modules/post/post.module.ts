import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService], // เผื่อโมดูลอื่นต้องการใช้งาน Service นี้
})
export class PostModule {}