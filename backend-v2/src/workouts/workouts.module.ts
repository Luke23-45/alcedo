import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MongoSyncIdempotencyStore,
  MongoWorkoutRepository,
} from './repositories/mongo-workout.repository';
import {
  SyncIdempotencyStore,
  WorkoutRepository,
} from './repositories/workout-repository.interface';
import { SyncIdempotencyRecord, SyncIdempotencySchema } from './schemas/sync-idempotency.schema';
import { Workout, WorkoutSchema } from './schemas/workout.schema';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';

@Module({
  controllers: [SyncController, WorkoutsController],
  exports: [WorkoutsService, WorkoutRepository],
  imports: [
    MongooseModule.forFeature([
      { name: Workout.name, schema: WorkoutSchema },
      { name: SyncIdempotencyRecord.name, schema: SyncIdempotencySchema },
    ]),
  ],
  providers: [
    SyncService,
    WorkoutsService,
    { provide: WorkoutRepository, useClass: MongoWorkoutRepository },
    { provide: SyncIdempotencyStore, useClass: MongoSyncIdempotencyStore },
  ],
})
export class WorkoutsModule {}
