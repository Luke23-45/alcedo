import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntitlementService } from './entitlement.service';
import { MongoUserRepository } from './repositories/mongo-user.repository';
import { UserRepository } from './repositories/user-repository.interface';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  exports: [UsersService, EntitlementService, UserRepository],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [
    UsersService,
    EntitlementService,
    { provide: UserRepository, useClass: MongoUserRepository },
  ],
})
export class UsersModule {}
