import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TResponse } from 'utils/common.type';
import { UploadFile } from 'utils/ultils';

@Injectable()
export class FileService {
  constructor(readonly prisma: PrismaService) {}

  async create(file: Express.Multer.File): Promise<TResponse<any>> {
    try {
      const data: any = await UploadFile(file);

      const res: any = await this.prisma.file.create({
        data: {
          fieldname: data?.public_id,
          originalname: data?.etag,
          path: data?.url,
          size: data?.bytes,
        },
      });

      return {
        status: HttpStatus.CREATED,
        data: res,
        message: 'Upload file success!',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }
}
