export interface SiteConfigRecord {
  key: string;
  /** Stored value: plaintext for non-secrets, ciphertext for secrets. */
  value: string;
  secret: boolean;
  updatedAt: Date;
}

/** Database-backed config overrides, editable from the admin panel. */
export abstract class SiteConfigRepository {
  abstract findByKey(key: string): Promise<SiteConfigRecord | null>;
  abstract upsert(key: string, value: string, secret: boolean): Promise<void>;
  abstract findAll(): Promise<SiteConfigRecord[]>;
}
