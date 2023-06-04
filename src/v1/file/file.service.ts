import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FileService {
  constructor(private peisma: PrismaService) {}

  async createFile(value: any) {
    try {
    } catch (error) {
      return new BadRequestException();
    }
  }
}
