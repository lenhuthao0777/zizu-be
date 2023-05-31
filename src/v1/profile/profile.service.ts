import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async create(createProfileDto: CreateProfileDto) {
    try {
      const data = await this.prisma.profile.create({ data: createProfileDto });
      return {
        code: HttpStatus.CREATED,
        data,
        message: 'Create profile success!',
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
