import { Module } from '@nestjs/common';
import { EntitlementService } from './entitlement.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

/**
 * Repository bindings live in the global PersistenceModule now — this module
 * only wires its services and controller. The UserRepository token resolves
 * to the MongoDB or PostgreSQL implementation per DB_PROVIDER.
 */
@Module({
  controllers: [UsersController],
  exports: [UsersService, EntitlementService],
  providers: [UsersService, EntitlementService],
})
export class UsersModule {}
