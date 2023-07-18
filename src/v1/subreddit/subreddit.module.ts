import { Module } from '@nestjs/common';
import { SubredditService } from './subreddit.service';
import { SubredditController } from './subreddit.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SubredditController],
  providers: [SubredditService, PrismaService],
})
export class SubredditModule {}
