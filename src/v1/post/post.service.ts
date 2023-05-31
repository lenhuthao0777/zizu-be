import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const data = await this.prisma.post.create({
        data: { ...createPostDto },
      });

      return {
        status: HttpStatus.CREATED,
        data,
        message: 'Create post success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.post.findMany();
      return {
        status: HttpStatus.OK,
        data,
        message: 'Get post success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.post.findUnique({ where: { id } });
      return {
        status: HttpStatus.OK,
        data,
        message: 'Get post success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      await this.prisma.post.update({
        where: { id },
        data: { ...updatePostDto },
      });
      return {
        status: HttpStatus.OK,
        data: {
          ...updatePostDto,
        },
        message: 'Update post success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const data = await this.prisma.post.delete({ where: { id } });
      return {
        status: HttpStatus.OK,
        data: {
          id: data?.id,
        },
        message: 'Delete post success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }
}
