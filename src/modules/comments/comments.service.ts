import { Injectable, NotFoundException, Inject, forwardRef, OnModuleInit, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';
import { PostStatus } from '../../common/enums/post-status.enum';

@Injectable()
export class CommentsService implements OnModuleInit {
  private readonly dataFilePath = resolve(process.cwd(), 'data', 'comments.json');
  private comments: CommentEntity[] = [];
  private idSeq = 1;

  constructor(
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf-8');
      const parsed = JSON.parse(data) as { comments: CommentEntity[]; nextId: number };
      this.comments = parsed.comments.map((c) => new CommentEntity({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
      }));
      this.idSeq = parsed.nextId;
    } catch {
      await this.ensureDataDirectory();
      await this.saveData();
    }
  }

  private async ensureDataDirectory(): Promise<void> {
    const dir = resolve(process.cwd(), 'data');
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
    }
  }

  private async saveData(): Promise<void> {
    await this.ensureDataDirectory();
    const data = {
      comments: this.comments,
      nextId: this.idSeq,
    };
    await fs.writeFile(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async create(dto: CreateCommentDto): Promise<CommentEntity> {
    let post;
    try {
      post = await this.postsService.findOne(dto.postId);
    } catch {
      throw new NotFoundException('ไม่พบ Post นี้ในระบบ (Post not found)');
    }
    
    if (post.status !== PostStatus.PUBLISHED) {
      throw new BadRequestException('ไม่สามารถคอมเมนต์โพสต์ที่ยังไม่เผยแพร่ได้ (Cannot comment on unpublished posts)');
    }
    
    try {
      await this.usersService.findOne(dto.userId);
    } catch {
      throw new NotFoundException('ไม่พบ User นี้ในระบบ (User not found)');
    }

    const comment = new CommentEntity({
      id: this.idSeq++,
      postId: dto.postId,
      userId: dto.userId,
      content: dto.content,
      createdAt: new Date(),
    });
    this.comments.push(comment);
    await this.saveData();
    return comment;
  }

  async findAll(postId?: number): Promise<CommentEntity[]> {
    if (typeof postId === 'number') {
      return this.comments.filter((c) => c.postId === postId);
    }
    return [...this.comments];
  }

  async findByUserId(userId: number): Promise<CommentEntity[]> {
    return this.comments.filter((c) => c.userId === userId);
  }

  async findOne(id: number): Promise<CommentEntity> {
    const found = this.comments.find((c) => c.id === id);
    if (!found) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return found;
  }

  async update(id: number, dto: UpdateCommentDto): Promise<CommentEntity> {
    const comment = await this.findOne(id);
    
    const updated = new CommentEntity({
      ...comment,
      ...dto,
      id: comment.id,
      postId: comment.postId,
      userId: comment.userId,
      createdAt: comment.createdAt,
      updatedAt: new Date(),
    });
    const idx = this.comments.findIndex((c) => c.id === id);
    this.comments[idx] = updated;
    await this.saveData();
    return updated;
  }

  async removeByPostId(postId: number): Promise<number> {
    const initialLength = this.comments.length;
    this.comments = this.comments.filter((c) => c.postId !== postId);
    const removedCount = initialLength - this.comments.length;
    await this.saveData();
    return removedCount;
  }

  async removeByUserId(userId: number): Promise<number> {
    const initialLength = this.comments.length;
    this.comments = this.comments.filter((c) => c.userId !== userId);
    const removedCount = initialLength - this.comments.length;
    await this.saveData();
    return removedCount;
  }

  async remove(id: number): Promise<CommentEntity> {
    const idx = this.comments.findIndex((c) => c.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    const [removed] = this.comments.splice(idx, 1);
    await this.saveData();
    return removed;
  }
}