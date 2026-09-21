import { streamToUint8Array, writeInChunks } from "@/utils/stream";
import { backupDatabaseAsync, openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

// A source database can predate a table (an old export being re-exported), so clear only what is
// actually there rather than letting one missing table fail the whole backup.
async function clearTables(db: SQLiteDatabase, tables: string[]) {
  const present = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type = 'table' AND name IN (${tables.map(() => "?").join(", ")})`,
    tables,
  );
  if (!present.length) {
    return;
  }
  await db.execAsync(present.map(({ name }) => `DELETE FROM "${name}";`).join("\n"));
}

export interface BackupBytes {
  /** The gzip-compressed payload that is uploaded or written to disk. */
  bytes: Uint8Array;
  /** The serialized database size before compression, for honest size copy. */
  rawBytes: number;
}

export async function getBackupBytes(options: {
  includeFeed: boolean;
  expoDb: SQLiteDatabase;
}): Promise<BackupBytes> {
  const { expoDb, includeFeed } = options;

  const backupDatabase = await openDatabaseAsync(":memory:", { useNewConnection: true });
  try {
    await backupDatabaseAsync({
      sourceDatabase: expoDb,
      destDatabase: backupDatabase,
    });
    // Backend configuration never travels in a backup: the blob is plaintext gzip sitting on the
    // very server whose credentials it would carry.
    await clearTables(backupDatabase, ["backend_header", "backend_assignment", "backend"]);
    if (!includeFeed) {
      await clearTables(backupDatabase, [
        "feed_items",
        "feed_identity",
        "feed_followed_user",
        "feed_follower_user",
        "feed_follow_request",
        "feed_revoked_follow_secrets",
        "feed_unpublished_sessions",
      ]);
    }
    const bytes = await backupDatabase.serializeAsync();
    const rawBytes = bytes.byteLength;
    const stream = new CompressionStream("gzip");
    const writer = stream.writable.getWriter();
    // Start draining before writing, or the chunked writes stall on backpressure.
    const gzippedPromise = streamToUint8Array(stream.readable);

    await writeInChunks(writer, bytes);
    await writer.close();
    return { bytes: await gzippedPromise, rawBytes };
  } finally {
    await backupDatabase.closeAsync();
  }
}
