import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { PrismaService } from 'src/prisma.service';
import { CloudinaryProvider } from 'config/cloudinary.config';

@Module({
  controllers: [FileController],
  providers: [FileService, CloudinaryProvider, PrismaService],
})
export class FileModule {}
