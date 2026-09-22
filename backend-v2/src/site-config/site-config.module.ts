import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteConfig, SiteConfigSchema } from './site-config.schema';
import { SiteConfigService } from './site-config.service';

@Module({
  exports: [SiteConfigService],
  imports: [MongooseModule.forFeature([{ name: SiteConfig.name, schema: SiteConfigSchema }])],
  providers: [SiteConfigService],
})
export class SiteConfigModule {}
