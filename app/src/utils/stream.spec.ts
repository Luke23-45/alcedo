import { streamToUint8Array, streamToUint8ArrayWithLimit, writeInChunks, DecompressionLimitError } from './stream';
import { gunzipSync } from 'fflate';
import { describe, expect, it, vi } from 'vitest';

function fakeWriter() {
  const chunks: Uint8Array[] = [];
  return {
    chunks,
    writer: {
      write: (chunk: Uint8Array) => {
        chunks.push(new Uint8Array(chunk));
        return Promise.resolve();
      },
    } as unknown as WritableStreamDefaultWriter<Uint8Array>,
  };
}

describe('writeInChunks', () => {
  const bytes = new Uint8Array(512 * 1024).map((_, i) => i % 251);

  it('delivers every byte in order', async () => {
    const { chunks, writer } = fakeWriter();
    await writeInChunks(writer, bytes);

    expect(chunks.length).toBeGreaterThan(1);
    expect(Buffer.concat(chunks)).toEqual(Buffer.from(bytes));
  });

  it('ramps the chunk size up so the cold pushes stay small', async () => {
    const { chunks, writer } = fakeWriter();
    await writeInChunks(writer, bytes);

    expect(chunks[0]!.length).toBe(4 * 1024);
    expect(chunks[1]!.length).toBe(8 * 1024);
    expect(chunks.at(-2)!.length).toBe(32 * 1024);
  });

  it('round trips through CompressionStream', async () => {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const gzipped = streamToUint8Array(stream.readable);
    await writeInChunks(writer, bytes);
    await writer.close();

    expect(gunzipSync(await gzipped)).toEqual(bytes);
  });

  it('waits for a frame when a chunk overruns the frame budget', async () => {
    const frameSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
    const nowSpy = vi.spyOn(performance, 'now');
    let clock = 0;
    nowSpy.mockImplementation(() => (clock += 100));

    const { writer } = fakeWriter();
    await writeInChunks(writer, bytes);

    expect(frameSpy).toHaveBeenCalled();
    nowSpy.mockRestore();
    frameSpy.mockRestore();
  });

  it('falls back to a timer when no frames are produced', async () => {
    const frameSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(0);
    const nowSpy = vi.spyOn(performance, 'now');
    let clock = 0;
    nowSpy.mockImplementation(() => (clock += 100));

    const { writer, chunks } = fakeWriter();
    await writeInChunks(writer, bytes);

    expect(Buffer.concat(chunks)).toEqual(Buffer.from(bytes));
    nowSpy.mockRestore();
    frameSpy.mockRestore();
  });

  it('does not yield when the writes stay inside the budget', async () => {
    const frameSpy = vi.spyOn(globalThis, 'requestAnimationFrame');
    const nowSpy = vi.spyOn(performance, 'now').mockReturnValue(0);

    const { writer } = fakeWriter();
    await writeInChunks(writer, bytes);

    expect(frameSpy).not.toHaveBeenCalled();
    nowSpy.mockRestore();
    frameSpy.mockRestore();
  });
});

/** A ReadableStream that yields the given chunks, like a decompressor would. */
function chunkStream(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller: ReadableStreamDefaultController<Uint8Array>) {
      for (const chunk of chunks) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

describe('streamToUint8ArrayWithLimit', () => {
  it('returns the bytes when under the limit', async () => {
    const chunks = [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5])];
    const result = await streamToUint8ArrayWithLimit(chunkStream(chunks), 16);
    expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5]));
  });

  it('throws DecompressionLimitError instead of accumulating past the limit', async () => {
    const chunks = [new Uint8Array(8), new Uint8Array(8), new Uint8Array(8)];
    const failure = await streamToUint8ArrayWithLimit(chunkStream(chunks), 16).then(
      () => undefined,
      (e: unknown) => e,
    );
    expect(failure).toBeInstanceOf(DecompressionLimitError);
    expect((failure as DecompressionLimitError).limit).toBe(16);
  });

  it('releases the reader lock even when the limit is breached', async () => {
    const stream = chunkStream([new Uint8Array(32)]);
    await expect(streamToUint8ArrayWithLimit(stream, 16)).rejects.toBeInstanceOf(DecompressionLimitError);
    // Would throw "locked" if the failed read had kept the reader.
    expect(() => stream.getReader()).not.toThrow();
  });
});
