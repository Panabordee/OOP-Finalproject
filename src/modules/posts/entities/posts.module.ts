import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './post.service';
import { CommentsController } from './post.controller';
import { PostsModule } from '../posts/posts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => PostsModule), UsersModule],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}