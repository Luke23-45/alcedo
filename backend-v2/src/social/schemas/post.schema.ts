import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * A minimal social post. Only the author can delete it (soft delete).
 * Only createdAt is tracked — posts are immutable besides the delete flag.
 */
@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Post {
  /** Author's Google `sub`. */
  @Prop({ required: true })
  authorId!: string;

  @Prop({ required: true, maxlength: 2000 })
  text!: string;

  /** HTTPS URLs only, at most 4 per post. */
  @Prop({ type: [String], default: [] })
  mediaUrls!: string[];

  /** Soft delete — deleted posts never appear in feeds. */
  @Prop({ required: false, default: null, type: Date })
  deletedAt?: Date | null;

  createdAt!: Date;
}

export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ authorId: 1, createdAt: -1 });
