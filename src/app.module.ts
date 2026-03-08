import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [ PostsModule, ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}