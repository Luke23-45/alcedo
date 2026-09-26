import { Module } from '@nestjs/common';
import { SiteConfigModule } from '../site-config/site-config.module';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';

/**
 * User model access comes from the global PersistenceModule (UserRepository
 * token); this module no longer registers its own Mongoose model.
 */
@Module({
  controllers: [AdminController],
  imports: [SiteConfigModule],
  providers: [AdminGuard],
})
export class AdminModule {}
