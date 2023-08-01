import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubredditDto } from './dto/create-subreddit.dto';
import { UpdateSubredditDto } from './dto/update-subreddit.dto';
import { TResponse } from 'utils/common.type';
import { PrismaService } from 'src/prisma.service';
import { Post, Subreddit, User, Vote, VoteType } from '@prisma/client';
import { INFINITE_SCROLLING_PAGINATION_RESULT } from 'utils/constants';
import { CachedPost } from 'types/global.type';

const CACHE_NUM = 1;
@Injectable()
export class SubredditService {
  constructor(readonly prisma: PrismaService) {}

  async create(
    createSubredditDto: CreateSubredditDto,
  ): Promise<TResponse<any>> {
    try {
      const subredditExists = await this.prisma.subreddit.findFirst({
        where: { name: createSubredditDto.name.toLocaleLowerCase() },
      });

      if (subredditExists) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'Subreddit already exists!',
        };
      }

      const subreddit: Subreddit = await this.prisma.subreddit.create({
        data: {
          name: createSubredditDto.name,
          creatorId: createSubredditDto.userId,
        },
      });

      await this.prisma.subscription.create({
        data: {
          userId: createSubredditDto.userId,
          subredditId: subreddit.id,
        },
      });

      return {
        status: HttpStatus.CREATED,
        data: { ...subreddit },
        message: 'Create success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async findAll(): Promise<TResponse<Subreddit[]>> {
    try {
      const data = await this.prisma.subreddit.findMany();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Get subreddit success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async findByName(name: string): Promise<TResponse<any>> {
    try {
      const res = this.prisma.subreddit.findFirst({
        where: {
          name: name.toLocaleUpperCase(),
        },
      });

      return {
        status: HttpStatus.OK,
        data: res,
        message: 'Get subreddit success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async findOne(name: string): Promise<TResponse<Subreddit>> {
    try {
      const data = await this.prisma.subreddit.findFirst({
        where: {
          name: name,
        },
        include: {
          posts: {
            include: {
              author: true,
              votes: true,
              comments: true,
              subreddit: true,
            },
          },
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      });

      return {
        status: HttpStatus.OK,
        data,
        message: 'Get subreddit success',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async update(
    id: string,
    updateSubredditDto: UpdateSubredditDto,
  ): Promise<TResponse<any>> {
    try {
      await this.prisma.subreddit.update({
        where: { id },
        data: {
          name: updateSubredditDto.name,
        },
      });
      return {
        status: HttpStatus.OK,
        message: 'Update subreddit success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async remove(id: string): Promise<TResponse<any>> {
    try {
      await this.prisma.subreddit.delete({
        where: {
          id,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Delete subreddit success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async vote(params: {
    postId: string;
    voteType: VoteType;
    userId: string;
  }): Promise<TResponse<any>> {
    try {
      const exitingVote: any = await this.prisma.vote.findFirst({
        where: {
          postId: params.postId,
          userId: params.userId,
        },
      });

      const post: any = await this.prisma.post.findUnique({
        where: {
          id: params.postId,
        },
        include: {
          author: true,
          votes: true,
        },
      });

      if (!post) {
        return {
          status: HttpStatus.BAD_GATEWAY,
          message: 'Post not found!',
        };
      }

      if (exitingVote) {
        if (exitingVote?.type === params.voteType) {
          await this.prisma.vote.delete({
            where: {
              userId_postId: {
                postId: params.postId,
                userId: params.userId,
              },
            },
          });
          return {
            status: HttpStatus.OK,
            message: 'vote!',
          };
        }

        await this.prisma.vote.update({
          where: {
            userId_postId: {
              postId: params.postId,
              userId: params.userId,
            },
          },
          data: {
            type: params.voteType,
          },
        });
      }

      await this.prisma.vote.create({
        data: {
          type: params.voteType,
          userId: params.userId,
          postId: params.postId,
        },
      });

      return {
        status: HttpStatus.OK,
        message: 'Vote success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }
}

// const votesAmt = post.votes.reduce((acc: any, vote: Vote) => {
//   if (vote.type === 'UP') return acc + 1;
//   if (vote.type === 'DOWN') return acc - 1;
//   return acc;
// }, 0);

// if (votesAmt > CACHE_NUM) {
//   const cachePayload: CachedPost = {
//     id: post?.id,
//     title: post?.title,
//     authorUserName: post?.author?.username,
//     content: post?.content,
//     currentVote: params?.voteType,
//     createAt: post?.createAt,
//   };

//   await this.prisma.vote.update({
//     where: {
//       userId_postId: {},
//     },
//   });
// }
