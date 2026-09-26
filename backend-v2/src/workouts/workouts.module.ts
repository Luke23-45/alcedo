import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

// Repository bindings (WorkoutRepository, SyncIdempotencyStore) are owned by
// the global PersistenceModule — this module injects the tokens directly and
// never touches Mongoose or Prisma itself.

@Module({
  controllers: [SyncController, WorkoutsController],
  exports: [WorkoutsService],
  providers: [SyncService, WorkoutsService],
})
export class WorkoutsModule {}
