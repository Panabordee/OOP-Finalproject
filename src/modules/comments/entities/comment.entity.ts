export class CommentEntity {
  id!: number;
  postId!: number;
  userId!: number;
  content!: string;
  createdAt!: Date;
  updatedAt?: Date;

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
  }
}