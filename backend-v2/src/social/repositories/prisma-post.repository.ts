import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import {
  CreatePostData,
  PostCursor,
  PostRecord,
  PostRepository,
} from './post-repository.interface';

type PostRow = Prisma.PostGetPayload<object>;

function toRecord(row: PostRow): PostRecord {
  return {
    authorId: row.authorId,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt ?? undefined,
    id: row.id.toString(),
    mediaUrls: row.mediaUrls,
    text: row.text,
  };
}

/** Null when the cursor/row id is not a valid Postgres row id. */
function parseRowId(id: string): bigint | null {
  try {
    return BigInt(id);
  } catch {
    return null;
  }
}

@Injectable()
export class PrismaPostRepository extends PostRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(authorId: string, data: CreatePostData): Promise<PostRecord> {
    const row = await this.prisma.post.create({
      data: { authorId, mediaUrls: data.mediaUrls ?? [], text: data.text },
    });
    return toRecord(row);
  }

  async findById(id: string): Promise<PostRecord | null> {
    const rowId = parseRowId(id);
    if (rowId === null) return null;
    const row = await this.prisma.post.findUnique({ where: { id: rowId } });
    return row ? toRecord(row) : null;
  }

  async softDelete(authorId: string, id: string): Promise<boolean> {
    const rowId = parseRowId(id);
    if (rowId === null) return false;
    // Author-scoped: another user's post is invisible to this query, so the
    // caller can 404 without leaking whether the post exists.
    const { count } = await this.prisma.post.updateMany({
      data: { deletedAt: new Date() },
      where: { authorId, deletedAt: null, id: rowId },
    });
    return count > 0;
  }

  async findFeed(
    authorIds: string[],
    before: PostCursor | null,
    limit: number,
  ): Promise<PostRecord[]> {
    if (authorIds.length === 0) return [];
    const and: Prisma.PostWhereInput[] = [{ authorId: { in: authorIds } }, { deletedAt: null }];
    if (before) {
      const rowId = parseRowId(before.id);
      // An unparseable cursor id can match nothing — treat the page as empty
      // rather than throwing on a caller-supplied value.
      if (rowId === null) return [];
      and.push({
        OR: [
          { createdAt: { lt: before.t } },
          { createdAt: { equals: before.t }, id: { lt: rowId } },
        ],
      });
    }
    const rows = await this.prisma.post.findMany({
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
      where: { AND: and },
    });
    return rows.map(toRecord);
  }
}
