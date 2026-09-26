import { ConflictException, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { AdminController, SetAdminBody, UpdateConfigBody } from './admin.controller';
import type { UserRecord, UserRepository } from '../users/repositories/user-repository.interface';

function makeController(opts: {
  user: { isAdmin: boolean } | null;
  adminCount?: number;
  storedConfig?: Array<{ key: string; secret: boolean; updatedAt: string; value: string }>;
}) {
  const findByGoogleSub = jest
    .fn()
    .mockResolvedValue(opts.user ? ({ ...opts.user, googleSub: 'google-sub-9' } as UserRecord) : null);
  const countAdmins = jest.fn().mockResolvedValue(opts.adminCount ?? 2);
  const setAdmin = jest.fn().mockResolvedValue(undefined);
  const count = jest.fn().mockResolvedValue(1);
  const listRecent = jest.fn().mockResolvedValue([]);
  const users = { findByGoogleSub, countAdmins, setAdmin, count, listRecent } as unknown as UserRepository;
  const siteConfig = {
    get: jest.fn(),
    list: jest.fn().mockResolvedValue(opts.storedConfig ?? []),
    set: jest.fn(),
  } as never;
  const controller = new AdminController(siteConfig as never, users);
  return { controller, setAdmin, siteConfig };
}

function validUpdate(overrides: Partial<UpdateConfigBody> = {}): UpdateConfigBody {
  const body = new UpdateConfigBody();
  body.key = 'ai.model';
  body.value = 'coach-primary';
  Object.assign(body, overrides);
  return body;
}

describe('AdminController', () => {
  describe('PUT /admin/users/:googleSub/admin', () => {
    it('grants admin to an existing user', async () => {
      const { controller, setAdmin } = makeController({ user: { isAdmin: false } });
      const body = new SetAdminBody();
      body.isAdmin = true;

      await controller.setAdmin('actor-sub', 'google-sub-9', body);

      expect(setAdmin).toHaveBeenCalledWith('google-sub-9', true);
    });

    it('throws 404 when the user does not exist', async () => {
      const { controller } = makeController({ user: null });
      const body = new SetAdminBody();
      body.isAdmin = true;

      await expect(controller.setAdmin('actor-sub', 'google-sub-nope', body)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws 409 when revoking the last remaining admin', async () => {
      const { controller, setAdmin } = makeController({
        adminCount: 1,
        user: { isAdmin: true },
      });
      const body = new SetAdminBody();
      body.isAdmin = false;

      await expect(controller.setAdmin('actor-sub', 'google-sub-9', body)).rejects.toThrow(
        ConflictException,
      );
      expect(setAdmin).not.toHaveBeenCalled();
    });

    it('allows revoking when other admins remain', async () => {
      const { controller, setAdmin } = makeController({
        adminCount: 3,
        user: { isAdmin: true },
      });
      const body = new SetAdminBody();
      body.isAdmin = false;

      await controller.setAdmin('actor-sub', 'google-sub-9', body);

      expect(setAdmin).toHaveBeenCalledWith('google-sub-9', false);
    });

    it('rejects a non-boolean isAdmin via DTO validation', async () => {
      const body = new SetAdminBody();
      (body as { isAdmin: unknown }).isAdmin = 'yes';

      const errors = await validate(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('isAdmin');
    });
  });

  describe('PUT /admin/config validation', () => {
    it('accepts a plain value update', async () => {
      expect(await validate(validUpdate())).toHaveLength(0);
    });

    it('rejects an unknown key', async () => {
      const errors = await validate(validUpdate({ key: 'evil.key' }));
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects a malformed baseUrl', async () => {
      const errors = await validate(
        validUpdate({ key: 'providers.litellm.baseUrl', value: 'not a url' }),
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('accepts a well-formed https baseUrl', async () => {
      const errors = await validate(
        validUpdate({ key: 'providers.litellm.baseUrl', value: 'https://gateway.internal:4000' }),
      );
      expect(errors).toHaveLength(0);
    });

    it('rejects a non-https/ftp baseUrl scheme', async () => {
      const errors = await validate(
        validUpdate({ key: 'providers.mem0.baseUrl', value: 'ftp://files.internal/' }),
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects malformed ai.guardrails JSON', async () => {
      const errors = await validate(validUpdate({ key: 'ai.guardrails', value: '{nope' }));
      expect(errors.length).toBeGreaterThan(0);
    });

    it('rejects ai.guardrails with mistyped extraInScope', async () => {
      const errors = await validate(
        validUpdate({ key: 'ai.guardrails', value: JSON.stringify({ extraInScope: [42] }) }),
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('accepts well-formed ai.guardrails JSON', async () => {
      const errors = await validate(
        validUpdate({
          key: 'ai.guardrails',
          value: JSON.stringify({ extraInScope: ['kettlebell'] }),
        }),
      );
      expect(errors).toHaveLength(0);
    });

    it('does not apply guardrails JSON validation to other keys', async () => {
      const errors = await validate(validUpdate({ value: '{nope' }));
      expect(errors).toHaveLength(0);
    });

    it('persists via SiteConfigService on valid input', async () => {
      const { controller, siteConfig } = makeController({ user: null });

      await controller.updateConfig('actor-sub', validUpdate({ key: 'ai.model', value: 'x' }));

      expect((siteConfig as unknown as { set: jest.Mock }).set).toHaveBeenCalledWith('ai.model', 'x');
    });
  });

  describe('GET /admin/config', () => {
    it('returns null updatedAt for unset keys (never an invalid date string)', async () => {
      const { controller } = makeController({ user: null });

      const result = (await controller.getConfig()) as {
        config: Array<{ key: string; updatedAt: string | null }>;
      };

      expect(result.config.length).toBeGreaterThan(0);
      for (const entry of result.config) {
        expect(entry.updatedAt === null || typeof entry.updatedAt === 'string').toBe(true);
        if (typeof entry.updatedAt === 'string' && entry.updatedAt) {
          expect(Number.isNaN(Date.parse(entry.updatedAt))).toBe(false);
        }
      }
    });
  });
});
