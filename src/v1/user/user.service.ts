import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getAllUser() {
    try {
      const data = await this.prisma.user.findMany({
        select: { email: true, name: true, createAt: true, updateAt: true },
      });
      return {
        status: HttpStatus.OK,
        data,
        message: 'Get User Success!',
      };
    } catch (error) {
      return new BadGatewayException(error);
    }
  }

  async deleteUser(id: string) {
    try {
      const data = await this.prisma.user.delete({ where: { id } });

      return {
        status: HttpStatus.OK,
        data: {
          id: data?.id,
          email: data?.email,
        },
        message: 'Delete Success!',
      };
    } catch (error) {
      return new BadGatewayException(error);
    }
  }
}
