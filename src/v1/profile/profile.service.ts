import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {
  constructor(readonly prisma: PrismaService) {}

  api = 'profile';

  async create(value: any) {
    try {
      const data = await this.prisma[this.api].create({ data: { ...value } });
      return {
        status: HttpStatus.CREATED,
        data,
        message: 'Create success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async findAll(query?: { pageSize?: number; perPage?: number }) {
    // const skip = Number(query.perPage - 1) * Number(query.pageSize);

    // const totalData: Array<any> = await this.prisma[this.api].findMany();

    // const totalPage = Math.ceil(totalData.length / query.pageSize);

    try {
      // const data: Array<any> = await this.prisma[this.api].findMany({
      //   skip: query.perPage ? skip : 0,
      //   take: query.pageSize,
      // });

      const data = await this.prisma.profile.findMany();

      return {
        status: HttpStatus.OK,
        data: {
          collections: data,
          // perPage: query.perPage,
          // pageSize: query.pageSize,
          // totalPage,
        },
        message: 'Get success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma[this.api].findUnique({ where: { id } });
      return {
        status: HttpStatus.OK,
        data,
        message: 'Get success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const data = await this.prisma[this.api].delete({ where: { id } });
      return {
        status: HttpStatus.OK,
        data: {
          id: data?.id,
        },
        message: 'Delete success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }

  async update(id: string, updateValue: any) {
    try {
      await this.prisma[this.api].update({
        where: { id },
        data: { ...updateValue },
      });
      return {
        status: HttpStatus.OK,
        data: {
          ...updateValue,
        },
        message: 'Update success!',
      };
    } catch (error) {
      return new BadRequestException();
    }
  }
}
