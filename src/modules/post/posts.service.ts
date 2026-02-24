import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './create-comment.dto';

// สมมติ Entity เบื้องต้น (ถ้าคุณมีไฟล์ entity แยก ให้ import มาแทนครับ)
export interface Comment {
  id: number;
  text: string;
  author: string;
  postId: number;
  createdAt: Date;
}

@Injectable()
export class PostsService {
  private posts = [{ id: 1, title: 'Post 1' }]; // ข้อมูลจำลองสำหรับทดสอบ
  private comments: Comment[] = [];

  // ฟังก์ชันต้องอยู่ข้างในปีกกาของ class เท่านั้น
  addComment(postId: number, dto: CreateCommentDto): Comment {
    // เช็คว่ามี post อยู่จริงไหม
    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      throw new NotFoundException(`ไม่พบโพสต์ ID ${postId}`);
    }

    const newComment: Comment = {
      id: Date.now(),
      text: dto.text,
      author: dto.author,
      postId: postId,
      createdAt: new Date(),
    };

    this.comments.push(newComment);
    return newComment;
  }
}