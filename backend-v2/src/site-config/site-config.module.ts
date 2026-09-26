import { Module } from '@nestjs/common';
import { SiteConfigService } from './site-config.service';

// The SiteConfigRepository binding is owned by the global
// PersistenceModule — this module injects the token directly.

@Module({
  exports: [SiteConfigService],
  providers: [SiteConfigService],
})
export class SiteConfigModule {}
