import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommonApi } from 'utils/commonApi';

@Injectable()
export class PostService extends CommonApi {
  api = 'post';
}
