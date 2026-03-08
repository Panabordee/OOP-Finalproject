import { PostStatus } from '../../../common/enums/post-status.enum';

export class PostEntity {
  id!: number;
  userId!: number;
  title!: string;
  content!: string;
  status!: PostStatus;
  createdAt!: Date;
  updatedAt?: Date;

  constructor(partial: Partial<PostEntity>) {
    Object.assign(this, partial);
  }
}
