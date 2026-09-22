import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { FollowRepository } from './repositories/follow-repository.interface';
import { MongoFollowRepository } from './repositories/mongo-follow.repository';
import { MongoPostRepository } from './repositories/mongo-post.repository';
import { PostRepository } from './repositories/post-repository.interface';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  controllers: [SocialController],
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    // For the follow-target existence check (404 SOCIAL_USER_NOT_FOUND).
    UsersModule,
  ],
  providers: [
    SocialService,
    { provide: FollowRepository, useClass: MongoFollowRepository },
    { provide: PostRepository, useClass: MongoPostRepository },
  ],
})
export class SocialModule {}
