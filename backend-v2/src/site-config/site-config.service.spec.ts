import { ConfigService } from '@nestjs/config';
import { SiteConfigRepository } from './repositories/site-config-repository.interface';
import { SiteConfigService } from './site-config.service';

function mockRepository(
  docs: Record<string, { secret: boolean; value: string }> = {},
): SiteConfigRepository {
  const store = new Map(Object.entries(docs));
  return {
    findByKey: (key: string) =>
      Promise.resolve(
        store.has(key)
          ? {
              key,
              secret: store.get(key)!.secret,
              updatedAt: new Date('2026-01-01T00:00:00.000Z'),
              value: store.get(key)!.value,
            }
          : null,
      ),
    findAll: () =>
      Promise.resolve(
        [...store.entries()].map(([key, v]) => ({
          key,
          secret: v.secret,
          updatedAt: new Date('2026-01-01T00:00:00.000Z'),
          value: v.value,
        })),
      ),
    upsert: (key: string, value: string, secret: boolean) => {
      store.set(key, { secret, value });
      return Promise.resolve();
    },
  };
}

function mockConfig(encryptionKey?: string): ConfigService {
  return {
    get: (key: string) => (key === 'CONFIG_ENCRYPTION_KEY' ? encryptionKey : undefined),
  } as unknown as ConfigService;
}

describe('SiteConfigService', () => {
  it('returns the default when no override is stored', async () => {
    const service = new SiteConfigService(mockRepository(), mockConfig('a'.repeat(64)));
    await expect(service.get('ai.model', 'coach-default')).resolves.toBe('coach-default');
    await expect(service.get('ai.model')).resolves.toBeNull();
  });

  it('stores and reads a non-secret value in plaintext', async () => {
    const service = new SiteConfigService(mockRepository(), mockConfig('a'.repeat(64)));
    await service.set('ai.model', 'coach-primary');
    await expect(service.get('ai.model')).resolves.toBe('coach-primary');
  });

  it('encrypts secret values at rest and decrypts on read', async () => {
    const repository = mockRepository();
    // Reach the underlying store through a second handle to assert ciphertext.
    const service = new SiteConfigService(repository, mockConfig('b'.repeat(64)));
    await service.set('providers.litellm.apiKey', 'sk-secret-123');
    // The stored value must not contain the plaintext.
    const stored = await repository.findByKey('providers.litellm.apiKey');
    expect(stored?.value).not.toContain('sk-secret-123');
    expect(stored?.secret).toBe(true);
    await expect(service.get('providers.litellm.apiKey')).resolves.toBe('sk-secret-123');
  });

  it('refuses to store secrets without an encryption key', async () => {
    const service = new SiteConfigService(mockRepository(), mockConfig(undefined));
    await expect(service.set('providers.litellm.apiKey', 'x')).rejects.toThrow(
      'CONFIG_ENCRYPTION_KEY',
    );
  });

  it('masks secret values in list()', async () => {
    const service = new SiteConfigService(mockRepository(), mockConfig('c'.repeat(64)));
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
