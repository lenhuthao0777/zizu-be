import { PostModule } from './v1/post/post.module';
import { Module } from '@nestjs/common';
import { UserModule } from './v1/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './v1/auth/auth.module';
import { PrismaService } from './prisma.service';
import { ProfileModule } from './v1/profile/profile.module';
import { SubredditModule } from './v1/subreddit/subreddit.module';
import { SubscriptionModule } from './v1/subscription/subscription.module';
import { FileModule } from './v1/file/file.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ProfileModule,
    FileModule,
    PostModule,
    SubredditModule,
    SubscriptionModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
