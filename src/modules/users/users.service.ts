import { Injectable, NotFoundException, ConflictException, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { promises as fs } from 'fs';
import { resolve } from 'path';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PostsService } from '../posts/posts.service';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly dataFilePath = resolve(process.cwd(), 'data', 'users.json');
  private users: UserEntity[] = [];
  private idSeq = 1;

  constructor(
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf-8');
      const parsed = JSON.parse(data) as { users: UserEntity[]; nextId: number };
      this.users = parsed.users.map((u) => new UserEntity({
        ...u,
        createdAt: new Date(u.createdAt),
        updatedAt: u.updatedAt ? new Date(u.updatedAt) : undefined,
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
      users: this.users,
      nextId: this.idSeq,
    };
    await fs.writeFile(this.dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existingUser = this.users.find((u) => u.username === dto.username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    
    const existingEmail = this.users.find((u) => u.email === dto.email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const user = new UserEntity({
      id: this.idSeq++,
      username: dto.username,
      email: dto.email,
      createdAt: new Date(),
    });
    this.users.push(user);
    await this.saveData();
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return [...this.users];
  }

  async findOne(id: number): Promise<UserEntity> {
    const found = this.users.find((u) => u.id === id);
    if (!found) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return found;
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    const updated = new UserEntity({
      ...user,
      ...dto,
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: new Date(),
    });
    const idx = this.users.findIndex((u) => u.id === id);
    this.users[idx] = updated;
    await this.saveData();
    return updated;
  }

  async remove(id: number): Promise<UserEntity> {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const [removed] = this.users.splice(idx, 1);
  
    // ถ้าลบ user แล้วลบ post กับ comment ด้วย
    await this.postsService.removeByUserId(id);
    await this.commentsService.removeByUserId(id);
    
    await this.saveData();
    return removed;
  }
}
