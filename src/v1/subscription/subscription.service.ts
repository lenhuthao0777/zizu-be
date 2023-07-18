import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { TResponse } from 'utils/common.type';
import { Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(readonly prisma: PrismaService) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<TResponse<any>> {
    try {
      const subscriptionExits = await this.prisma.subscription.findFirst({
        where: {
          subredditId: createSubscriptionDto.subredditId,
          userId: createSubscriptionDto.userId,
        },
      });

      if (subscriptionExits) {
        return {
          status: HttpStatus.CONFLICT,
          message: 'Data conflict',
        };
      }

      const res = await this.prisma.subscription.create({
        data: {
          subredditId: createSubscriptionDto.subredditId,
          userId: createSubscriptionDto.userId,
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

  async findAll(queries: any): Promise<TResponse<Array<Subscription>>> {
    try {
      const res = await this.prisma.subscription.findMany({
        where: {
          ...queries,
        },
      });

      return {
        status: HttpStatus.OK,
        data: res,
        message: 'Get subscription success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async findOne(name: string, queries: any): Promise<TResponse<Subscription>> {
    try {
      const res = await this.prisma.subscription.findFirst({
        where: {
          subreddit: {
            name: name,
          },
          user: {
            id: queries.userId,
          },
        },
      });
      return {
        status: HttpStatus.OK,
        data: res,
        message: 'Get subscription success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }

  async unsubscribed(
    deleteSubscriptionDto: Pick<
      CreateSubscriptionDto,
      'subredditId' | 'userId'
    >,
  ): Promise<TResponse<any>> {
    try {
      const subscriptionExits = await this.prisma.subscription.findFirst({
        where: {
          subredditId: deleteSubscriptionDto.subredditId,
          userId: deleteSubscriptionDto.userId,
        },
      });

      if (!subscriptionExits) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'You are not  subscribed to this subreddit!',
        };
      }

      const subreddit = await this.prisma.subreddit.findFirst({
        where: {
          id: deleteSubscriptionDto.subredditId,
          creatorId: deleteSubscriptionDto.userId,
        },
      });

      if (subreddit) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'You cant unsubscribe from your own subreddit!',
        };
      }

      const res = await this.prisma.subscription.delete({
        where: {
          userId_subredditId: {
            subredditId: deleteSubscriptionDto.subredditId,
            userId: deleteSubscriptionDto.userId,
          },
        },
      });

      return {
        status: HttpStatus.OK,
        data: res,
        message: 'Unsubscribe success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async count(name: string): Promise<TResponse<any>> {
    try {
      const memberCount = await this.prisma.subscription.count({
        where: {
          subreddit: {
            name,
          },
        },
      });

      return {
        status: HttpStatus.OK,
        data: memberCount,
        message: 'Count success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }
}
