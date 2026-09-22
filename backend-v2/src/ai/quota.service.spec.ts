import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { QuotaService } from './quota.service';
import { AiDailyUsage } from './schemas/ai-daily-usage.schema';

describe('QuotaService', () => {
  let service: QuotaService;
  let findOneAndUpdate: jest.Mock;
  let exec: jest.Mock;

  const configGet = jest.fn((key: string, fallback: unknown) => {
    if (key === 'AI_FREE_DAILY_QUOTA') return 20;
    if (key === 'AI_PREMIUM_DAILY_QUOTA') return 200;
    return fallback;
  });

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-22T10:00:00Z'));
    exec = jest.fn();
    findOneAndUpdate = jest.fn().mockReturnValue({ exec });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotaService,
        { provide: ConfigService, useValue: { get: configGet } },
        {
          provide: getModelToken(AiDailyUsage.name),
          useValue: { findOneAndUpdate },
        },
      ],
    }).compile();
    service = module.get(QuotaService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('reserves quota atomically when under the limit', async () => {
    exec.mockResolvedValue({ count: 5 });
    await expect(service.checkAndReserve('sub-1', false)).resolves.toBeUndefined();
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { date: '2026-09-22', userId: 'sub-1' },
      { $inc: { count: 1 } },
      { new: true, setDefaultsOnInsert: true, upsert: true },
    );
  });

  it('throws 429 AI_QUOTA_EXCEEDED when over the free limit', async () => {
    exec.mockResolvedValue({ count: 21 });
    const err = await service.checkAndReserve('sub-1', false).catch((e) => e);
    expect(err).toBeInstanceOf(HttpException);
    expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    const body = err.getResponse() as Record<string, unknown>;
    expect(body.code).toBe('AI_QUOTA_EXCEEDED');
    expect(body.details).toMatchObject({ limit: 20 });
    expect(typeof (body.details as Record<string, unknown>).resetsAt).toBe('string');
  });

  it('applies the premium limit for premium users', async () => {
    exec.mockResolvedValue({ count: 21 });
    // 21 calls is over the free limit of 20 but under the premium limit of 200.
    await expect(service.checkAndReserve('sub-2', true)).resolves.toBeUndefined();
    exec.mockResolvedValue({ count: 201 });
    const err = await service.checkAndReserve('sub-2', true).catch((e) => e);
    expect(err).toBeInstanceOf(HttpException);
    expect((err.getResponse() as Record<string, unknown>).code).toBe('AI_QUOTA_EXCEEDED');
  });

  it('keys usage by UTC day so limits roll over at midnight', async () => {
    exec.mockResolvedValue({ count: 1 });
    await service.checkAndReserve('sub-1', false);
    const firstDate = findOneAndUpdate.mock.calls[0][0].date;
    jest.setSystemTime(new Date('2026-09-23T00:00:01Z'));
    await service.checkAndReserve('sub-1', false);
    const secondDate = findOneAndUpdate.mock.calls[1][0].date;
    expect(firstDate).toBe('2026-09-22');
    expect(secondDate).toBe('2026-09-23');
  });
});
