import { Injectable, NotFoundException, Inject, forwardRef, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostStatus } from '../../common/enums/post-status.enum';
import { CommentsService } from '../comments/comments.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService implements OnModuleInit {
  private readonly dataFilePath = resolve(process.cwd(), 'data', 'posts.json');
  private posts: PostEntity[] = [];
  private idSeq = 1;

  constructor(
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf-8');
      const parsed = JSON.parse(data) as { posts: PostEntity[]; nextId: number };
      this.posts = parsed.posts.map((p) => new PostEntity({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined,
      }));
      this.idSeq = parsed.nextId;
    } catch {
      // File doesn't exist or is invalid, start fresh
      await this.ensureDataDirectory();
      await this.saveData();
    }
  }

  private async ensureDataDirectory(): Promise<void> {
    const dir = resolve(process.cwd(), 'data');
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private async saveData(): Promise<void> {
    await this.ensureDataDirectory();
    const data = {
      posts: this.posts,
      nextId: this.idSeq,
    };
    await fs.writeFile(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async create(dto: CreatePostDto): Promise<PostEntity> {
    // Validate that the user exists
    try {
      await this.usersService.findOne(dto.userId);
    } catch {
      throw new NotFoundException('ไม่พบ User นี้ในระบบ (User not found)');
    }

    const post = new PostEntity({
      id: this.idSeq++,
      userId: dto.userId,
      title: dto.title,
      content: dto.content,
      status: dto.status ?? PostStatus.DRAFT,
      createdAt: new Date(),
    });
    this.posts.push(post);
    await this.saveData();
    return post;
  }

  async findAll(): Promise<PostEntity[]> {
    return [...this.posts];
  }

  async findByUserId(userId: number): Promise<PostEntity[]> {
    return this.posts.filter((p) => p.userId === userId);
  }

  async findOne(id: number): Promise<PostEntity> {
    const found = this.posts.find((p) => p.id === id);
    if (!found) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return found;
  }

  async update(id: number, dto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findOne(id);
    const updated = new PostEntity({
      ...post,
      ...dto,
      id: post.id,
      userId: post.userId,
      createdAt: post.createdAt,
      updatedAt: new Date(),
    });
    const idx = this.posts.findIndex((p) => p.id === id);
    this.posts[idx] = updated;
    await this.saveData();
    return updated;
  }

  async remove(id: number): Promise<PostEntity> {
    const post = await this.findOne(id);
    const idx = this.posts.findIndex((p) => p.id === id);
    const [removed] = this.posts.splice(idx, 1);
    
    // Cascade delete: remove all comments for this post
    await this.commentsService.removeByPostId(id);
    
    await this.saveData();
    return removed;
  }

  async removeByUserId(userId: number): Promise<number> {
    const postsToDelete = this.posts.filter((p) => p.userId === userId);
    // First, loop over posts to delete their comments
    for (const post of postsToDelete) {
      await this.commentsService.removeByPostId(post.id);
    }
    // Then remove the posts using filter
    const initialLength = this.posts.length;
    this.posts = this.posts.filter((p) => p.userId !== userId);
    const removedCount = initialLength - this.posts.length;
    await this.saveData();
    return removedCount;
  }
}