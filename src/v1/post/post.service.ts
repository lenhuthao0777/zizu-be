import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { TResponse } from 'utils/common.type';

@Injectable()
export class PostService {
  constructor(readonly prisma: PrismaService) {}
  api = 'post';

  async create(body: CreatePostDto) {
    return {
      body,
    };
  }

  async findAll(params: any) {
    return 'test';
  }

  async findOne(id: string): Promise<TResponse<any>> {
    try {
      const res = this.prisma.post.findFirst({
        where: {
          id,
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

  async update(id: string, body: UpdatePostDto) {
    return 'update';
  }

  async remove(id: string) {
    return 'test remove' + id;
  }
}
