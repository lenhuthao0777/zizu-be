import { Post } from '../entities/post.entity';

export class CreatePostDto extends Post {
  subredditId: string;
  title: string;
  content: string;
  userId: string;
  fileId: string;
}
