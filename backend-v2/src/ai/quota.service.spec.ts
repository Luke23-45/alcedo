import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QuotaService } from './quota.service';
import { AiDailyUsageRepository } from './repositories/ai-daily-usage-repository.interface';

describe('QuotaService', () => {
  let service: QuotaService;
  let incrementAndGet: jest.Mock;

  const configGet = jest.fn((key: string, fallback: unknown) => {
    if (key === 'AI_FREE_DAILY_QUOTA') return 20;
    if (key === 'AI_PREMIUM_DAILY_QUOTA') return 200;
    return fallback;
  });

  beforeEach(async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-09-22T10:00:00Z'));
    incrementAndGet = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotaService,
        { provide: ConfigService, useValue: { get: configGet } },
        {
          provide: AiDailyUsageRepository,
          useValue: { incrementAndGet },
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
    incrementAndGet.mockResolvedValue(5);
    await expect(service.checkAndReserve('sub-1', false)).resolves.toBeUndefined();
    expect(incrementAndGet).toHaveBeenCalledWith('sub-1', '2026-09-22');
  });

  it('throws 429 AI_QUOTA_EXCEEDED when over the free limit', async () => {
    incrementAndGet.mockResolvedValue(21);
    const err = await service.checkAndReserve('sub-1', false).catch((e) => e);
    expect(err).toBeInstanceOf(HttpException);
    expect(err.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    const body = err.getResponse() as Record<string, unknown>;
    expect(body.code).toBe('AI_QUOTA_EXCEEDED');
    expect(body.details).toMatchObject({ limit: 20 });
    expect(typeof (body.details as Record<string, unknown>).resetsAt).toBe('string');
  });

  it('applies the premium limit for premium users', async () => {
    incrementAndGet.mockResolvedValue(21);
    // 21 calls is over the free limit of 20 but under the premium limit of 200.
    await expect(service.checkAndReserve('sub-2', true)).resolves.toBeUndefined();
    incrementAndGet.mockResolvedValue(201);
    const err = await service.checkAndReserve('sub-2', true).catch((e) => e);
    expect(err).toBeInstanceOf(HttpException);
    expect((err.getResponse() as Record<string, unknown>).code).toBe('AI_QUOTA_EXCEEDED');
  });

  it('keys usage by UTC day so limits roll over at midnight', async () => {
    incrementAndGet.mockResolvedValue(1);
    await service.checkAndReserve('sub-1', false);
    const firstDate = incrementAndGet.mock.calls[0][1];
    jest.setSystemTime(new Date('2026-09-23T00:00:01Z'));
    await service.checkAndReserve('sub-1', false);
    const secondDate = incrementAndGet.mock.calls[1][1];
    expect(firstDate).toBe('2026-09-22');
    expect(secondDate).toBe('2026-09-23');
  });
});
