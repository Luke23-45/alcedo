import { Controller, Get } from '@nestjs/common';

/**
 * Feature advertisement for Alcedo mobile clients.
 *
 * The app's backend editor probes `GET /features` before a backend can be
 * assigned to a feature. The response is a plain object mapping feature
 * names to booleans — every key the client knows about must be present so
 * the probe can distinguish "unsupported" from "unknown".
 *
 * `sync` is a backend-v2 feature the mobile app is gaining (workout
 * synchronization); it is not part of the legacy feature set.
 */
export interface FeatureMap {
  feed: boolean;
  aiPlanner: boolean;
  backup: boolean;
  sharing: boolean;
  sync: boolean;
}

@Controller('features')
export class FeaturesController {
  @Get()
  getFeatures(): FeatureMap {
    return {
      // The E2E-encrypted feed event protocol is not implemented here.
      feed: false,
      aiPlanner: true,
      // Backups stay user-controlled; this backend does not accept blobs.
      backup: false,
      sharing: false,
      sync: true,
    };
  }
}
