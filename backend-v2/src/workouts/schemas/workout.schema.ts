import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class WorkoutSet {
  @Prop({ required: false })
  reps?: number;

  @Prop({ required: false })
  weight?: number;

  /** Unit for `weight`, e.g. 'kg' or 'lb'. */
  @Prop({ required: false })
  unit?: string;

  @Prop({ required: false })
  rpe?: number;
}
export const WorkoutSetSchema = SchemaFactory.createForClass(WorkoutSet);

@Schema({ _id: false })
export class WorkoutExercise {
  @Prop({ required: true })
  exerciseId!: string;

  @Prop({ type: [WorkoutSetSchema], default: [] })
  sets!: WorkoutSet[];

  @Prop({ required: false })
  notes?: string;
}
export const WorkoutExerciseSchema = SchemaFactory.createForClass(WorkoutExercise);

@Schema({ timestamps: true })
export class Workout {
  /**
   * Client-generated UUID, shared between the phone's SQLite row and this
   * document, so retries and reinstalls never fork the same workout.
   * Stable identity lives here — the Mongo `_id` is only a cursor tiebreaker.
   */
  @Prop({ required: true })
  clientId!: string;

  /** Owner's Google `sub`. Every query is scoped to this field. */
  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true, maxlength: 120 })
  name!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ type: [WorkoutExerciseSchema], default: [] })
  exercises!: WorkoutExercise[];

  /**
   * Monotonic per-entity version. Starts at 0; every accepted mutation
   * (sync push, CRUD patch, soft delete) bumps it by exactly one, so a
   * stale `baseVersion` is always detectable.
   */
  @Prop({ required: true, default: 0 })
  version!: number;

  /** Soft delete — tombstones propagate through pull sync, never vanish silently. */
  @Prop({ required: false, default: null, type: Date })
  deletedAt?: Date | null;

  /** Server write time; drives the pull cursor. */
  @Prop({ required: true, default: () => new Date() })
  serverUpdatedAt!: Date;

  /** Set by mongoose timestamps; declared for typed access. */
  createdAt!: Date;
  updatedAt!: Date;
}

export type WorkoutDocument = HydratedDocument<Workout>;
export const WorkoutSchema = SchemaFactory.createForClass(Workout);
WorkoutSchema.index({ userId: 1, serverUpdatedAt: 1 });
WorkoutSchema.index({ userId: 1, clientId: 1 }, { unique: true });
WorkoutSchema.index({ userId: 1, deletedAt: 1 });
