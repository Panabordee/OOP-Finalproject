import { BaseEntity } from '../../common/interfaces/base-entity.interface';

export interface Post extends BaseEntity {
  title: string;
  content: string;
}