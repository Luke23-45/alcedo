import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SiteConfigRepository } from './repositories/site-config-repository.interface';
import { decryptSecret, encryptSecret, maskSecret } from './secret-crypto';

export interface ConfigEntry {
  key: string;
  /** Plaintext for non-secrets; masked preview for secrets. */
  value: string;
  secret: boolean;
  updatedAt: string;
}

/** Keys whose values are encrypted at rest and masked in admin reads. */
const SECRET_KEYS = new Set([
  'providers.litellm.apiKey',
  'providers.mem0.apiKey',
  'billing.stripe.webhookSecret',
]);

/**
 * Database-backed backend configuration, editable from the admin panel.
 * Reads fall back to the provided default when no override is stored;
 * secret values are encrypted at rest and never returned in plaintext.
 */
@Injectable()
export class SiteConfigService {
  private readonly logger = new Logger(SiteConfigService.name);

  constructor(
    private readonly store: SiteConfigRepository,
    private readonly config: ConfigService,
  ) {}

  /** Reads a config value, falling back to `defaultValue` when unset. */
  async get(key: string, defaultValue: string | null = null): Promise<string | null> {
    const doc = await this.store.findByKey(key);
    if (!doc) return defaultValue;
    if (doc.secret) {
      const encryptionKey = this.config.get<string>('CONFIG_ENCRYPTION_KEY');
      if (!encryptionKey) {
        this.logger.warn(`Secret config '${key}' set but CONFIG_ENCRYPTION_KEY is missing.`);
        return defaultValue;
      }
      try {
        return decryptSecret(doc.value, encryptionKey);
      } catch {
        this.logger.warn(`Could not decrypt secret config '${key}'.`);
        return defaultValue;
      }
    }
    return doc.value;
  }

  /** Writes a config value. Secret keys are encrypted at rest. */
  async set(key: string, value: string): Promise<void> {
    const secret = SECRET_KEYS.has(key);
    let stored = value;
    if (secret) {
      const encryptionKey = this.config.get<string>('CONFIG_ENCRYPTION_KEY');
      if (!encryptionKey) {
        throw new Error('CONFIG_ENCRYPTION_KEY must be set to store secrets.');
      }
      stored = encryptSecret(value, encryptionKey);
    }
    await this.store.upsert(key, stored, secret);
  }

  /** All config entries for the admin panel. Secrets are masked. */
  async list(): Promise<ConfigEntry[]> {
    const docs = await this.store.findAll();
    const entries: ConfigEntry[] = [];
    for (const doc of docs) {
      let display = doc.value;
      if (doc.secret) {
        const encryptionKey = this.config.get<string>('CONFIG_ENCRYPTION_KEY');
        if (encryptionKey) {
          try {
            display = maskSecret(decryptSecret(doc.value, encryptionKey));
          } catch {
            display = '••••••••';
          }
        } else {
          display = '••••••••';
        }
      }
      entries.push({
        key: doc.key,
        secret: doc.secret,
        updatedAt: doc.updatedAt.toISOString(),
        value: display,
      });
    }
    return entries.sort((a, b) => a.key.localeCompare(b.key));
  }
}
