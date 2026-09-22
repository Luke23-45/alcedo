import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { FollowUserDto } from './dto/follow.dto';
import { SocialService } from './social.service';

class PageQuery {
  @IsString()
  @IsOptional()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  /** Idempotent: following someone you already follow is a 200, not an error. */
  @Post('follow')
  @HttpCode(HttpStatus.OK)
  follow(@CurrentUserSub() googleSub: string, @Body() dto: FollowUserDto) {
    return this.socialService.follow(googleSub, dto.userId);
  }

  /** Idempotent: unfollowing a non-edge is a no-op. */
  @Delete('follow/:userId')
  unfollow(@CurrentUserSub() googleSub: string, @Param('userId') userId: string) {
    return this.socialService.unfollow(googleSub, userId);
  }

  @Get('followers')
  followers(@CurrentUserSub() googleSub: string, @Query() query: PageQuery) {
    return this.socialService.followers(googleSub, query.cursor, query.limit);
  }

  @Get('following')
  following(@CurrentUserSub() googleSub: string, @Query() query: PageQuery) {
    return this.socialService.following(googleSub, query.cursor, query.limit);
  }

  @Post('posts')
  @HttpCode(HttpStatus.CREATED)
  createPost(@CurrentUserSub() googleSub: string, @Body() dto: CreatePostDto) {
    return this.socialService.createPost(googleSub, dto);
  }

  /** Posts from followed users, newest first. */
  @Get('feed')
  feed(@CurrentUserSub() googleSub: string, @Query() query: PageQuery) {
    return this.socialService.feed(googleSub, query.cursor, query.limit);
  }

  /** Author-only soft delete. */
  @Delete('posts/:id')
  deletePost(@CurrentUserSub() googleSub: string, @Param('id') id: string) {
    return this.socialService.deletePost(googleSub, id);
  }
}
