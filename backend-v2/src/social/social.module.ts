import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

// Repository bindings (PostRepository, FollowRepository) are owned by the
// global PersistenceModule — this module injects the tokens directly.

@Module({
  controllers: [SocialController],
  imports: [
    // For the follow-target existence check (404 SOCIAL_USER_NOT_FOUND).
    UsersModule,
  ],
  providers: [SocialService],
})
export class SocialModule {}
