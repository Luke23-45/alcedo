import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * A directed follow edge between two Google `sub` identities.
 * Only createdAt is tracked — the edge has no mutable state worth an updatedAt.
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Follow {
  @Prop({ required: true })
  followerId!: string;

  @Prop({ required: true })
  followeeId!: string;

  createdAt!: Date;
}

export type FollowDocument = HydratedDocument<Follow>;
export const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });
FollowSchema.index({ followeeId: 1 });
