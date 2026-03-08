import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [UsersModule, PostsModule, CommentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}