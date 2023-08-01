import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { TResponse } from 'utils/common.type';
import { number } from 'zod';

@Injectable()
export class PostService {
  constructor(readonly prisma: PrismaService) {}
  api = 'post';

  async create(createPostDto: CreatePostDto): Promise<TResponse<any>> {
    try {
      const subscriptionExits = await this.prisma.subscription.findFirst({
        where: {
          subredditId: createPostDto.subredditId,
          userId: createPostDto.userId,
        },
      });

      if (!subscriptionExits) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Subscribe to the post!',
        };
      }

      const res = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          subredditId: createPostDto.subredditId,
          authorId: createPostDto.userId,
          fileId: createPostDto.fileId,
        },
      });

      return {
        status: HttpStatus.CREATED,
        data: res,
        message: 'Create success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async findOne(id: string): Promise<TResponse<any>> {
    try {
      const res = await this.prisma.post.findFirst({
        where: {
          id,
        },
        include: {
          votes: true,
          comments: true,
          author: true,
        },
      });

      return {
        status: HttpStatus.OK,
        data: res,
        message: 'Get post success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async list(queries: {
    userId: string;
    page: string | number;
    subredditName: string;
    limit: string | number;
  }): Promise<TResponse<any>> {
    try {
      let followerCommunitiesIds: string[] = [];

      const followerCommunities = await this.prisma.subscription.findMany({
        where: {
          userId: queries.userId,
        },
        include: {
          subreddit: true,
        },
      });

      followerCommunitiesIds = followerCommunities.map(
        (item) => item.subreddit.id,
      );

      const handleQueries = () => {
        if (queries.subredditName) {
          return {
            subreddit: {
              name: queries.subredditName,
            },
          };
        }

        if (queries.userId) {
          return {
            subreddit: {
              id: {
                in: followerCommunitiesIds,
              },
            },
          };
        }
      };

      const res = await this.prisma.post.findMany({
        take: Number(queries.limit),
        skip: (Number(queries.page) - 1) * Number(queries.limit),
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          subreddit: true,
          votes: true,
          author: true,
          comments: true,
        },
        where: handleQueries(),
      });

      return {
        status: HttpStatus.OK,
        data: res,
        message: 'Get post success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async update(id: string, body: UpdatePostDto) {
    return 'update';
  }

  async remove(id: string) {
    return 'test remove' + id;
  }
}
