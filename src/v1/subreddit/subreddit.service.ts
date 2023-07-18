import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubredditDto } from './dto/create-subreddit.dto';
import { UpdateSubredditDto } from './dto/update-subreddit.dto';
import { TResponse } from 'utils/common.type';
import { PrismaService } from 'src/prisma.service';
import { Subreddit } from '@prisma/client';
import { z } from 'zod';
import { INFINITE_SCROLLING_PAGINATION_RESULT } from 'utils/constants';

@Injectable()
export class SubredditService {
  constructor(readonly prisma: PrismaService) {}

  async create(
    createSubredditDto: CreateSubredditDto,
  ): Promise<TResponse<any>> {
    try {
      const subredditExists = await this.prisma.subreddit.findFirst({
        where: { name: createSubredditDto.name },
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

  async findOne(name: string): Promise<TResponse<Subreddit>> {
    try {
      const data = await this.prisma.subreddit.findFirst({
        where: {
          name,
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
}
