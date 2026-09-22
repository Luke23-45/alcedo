import { ConfigService } from '@nestjs/config';
import { SiteConfigService } from './site-config.service';

function mockModel(docs: Record<string, { secret: boolean; value: string }> = {}) {
  const store = new Map(Object.entries(docs));
  return {
    findOne: (filter: { key: string }) => ({
      lean: () => ({
        exec: () => Promise.resolve(store.get(filter.key) ?? null),
      }),
    }),
    findOneAndUpdate: (filter: { key: string }, update: { $set: { secret: boolean; value: string } }) => ({
      exec: () => {
        store.set(filter.key, update.$set);
        return Promise.resolve(update.$set);
      },
    }),
    find: () => ({
      lean: () => ({
        exec: () =>
          Promise.resolve(
            [...store.entries()].map(([key, v]) => ({
              key,
              ...v,
              updatedAt: new Date('2026-01-01T00:00:00.000Z'),
            })),
          ),
      }),
    }),
  } as never;
}

function mockConfig(encryptionKey?: string): ConfigService {
  return {
    get: (key: string) => (key === 'CONFIG_ENCRYPTION_KEY' ? encryptionKey : undefined),
  } as unknown as ConfigService;
}

describe('SiteConfigService', () => {
  it('returns the default when no override is stored', async () => {
    const service = new SiteConfigService(mockModel(), mockConfig('a'.repeat(64)));
    await expect(service.get('ai.model', 'coach-default')).resolves.toBe('coach-default');
    await expect(service.get('ai.model')).resolves.toBeNull();
  });

  it('stores and reads a non-secret value in plaintext', async () => {
    const service = new SiteConfigService(mockModel(), mockConfig('a'.repeat(64)));
    await service.set('ai.model', 'coach-primary');
    await expect(service.get('ai.model')).resolves.toBe('coach-primary');
  });

  it('encrypts secret values at rest and decrypts on read', async () => {
    const store = new Map<string, { secret: boolean; value: string }>();
    const model = {
      findOne: (filter: { key: string }) => ({
        lean: () => ({
          exec: () => Promise.resolve(store.get(filter.key) ?? null),
        }),
      }),
      findOneAndUpdate: (filter: { key: string }, update: { $set: { secret: boolean; value: string } }) => ({
        exec: () => {
          store.set(filter.key, update.$set);
          return Promise.resolve(update.$set);
        },
      }),
      find: () => ({ lean: () => ({ exec: () => Promise.resolve([]) }) }),
    } as never;
    const service = new SiteConfigService(model, mockConfig('b'.repeat(64)));
    await service.set('providers.litellm.apiKey', 'sk-secret-123');
    // The stored value must not contain the plaintext.
    const stored = store.get('providers.litellm.apiKey');
    expect(stored?.value).not.toContain('sk-secret-123');
    await expect(service.get('providers.litellm.apiKey')).resolves.toBe('sk-secret-123');
  });

  it('refuses to store secrets without an encryption key', async () => {
    const service = new SiteConfigService(mockModel(), mockConfig(undefined));
    await expect(service.set('providers.litellm.apiKey', 'x')).rejects.toThrow(
      'CONFIG_ENCRYPTION_KEY',
    );
  });

  it('masks secret values in list()', async () => {
    const service = new SiteConfigService(mockModel(), mockConfig('c'.repeat(64)));
    await service.set('providers.litellm.apiKey', 'sk-secret-123');
    await service.set('ai.model', 'coach-primary');
    const entries = await service.list();
    const secret = entries.find((e) => e.key === 'providers.litellm.apiKey');
    const plain = entries.find((e) => e.key === 'ai.model');
    expect(secret?.secret).toBe(true);
    expect(secret?.value).not.toContain('sk-secret-123');
    expect(plain?.value).toBe('coach-primary');
  });
});
