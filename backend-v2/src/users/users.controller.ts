import { Body, Controller, Get, NotFoundException, Patch } from '@nestjs/common';
import { CurrentUserSub } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EntitlementService, EntitlementStatus } from './entitlement.service';
import { UserRecord } from './repositories/user-repository.interface';
import { UsersService } from './users.service';

function notFound(): NotFoundException {
  return new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found.' });
}

function toProfileResponse(user: UserRecord, entitlement: EntitlementStatus) {
  return {
    createdAt: user.createdAt,
    email: user.email ?? null,
    entitlement,
    googleSub: user.googleSub,
    name: user.name ?? null,
    picture: user.picture ?? null,
    units: user.units,
    updatedAt: user.updatedAt,
  };
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly entitlementService: EntitlementService,
  ) {}

  /** Own profile plus the current entitlement state. */
  @Get('me')
  async me(@CurrentUserSub() googleSub: string) {
    const user = await this.usersService.getProfile(googleSub);
    const entitlement = await this.entitlementService.getStatus(googleSub);
    return toProfileResponse(user, entitlement);
  }

  @Patch('me')
  async updateMe(@CurrentUserSub() googleSub: string, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(googleSub, dto);
    if (!user) throw notFound();
    const entitlement = await this.entitlementService.getStatus(googleSub);
    return toProfileResponse(user, entitlement);
  }
}
