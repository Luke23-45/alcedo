import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { DatabaseHealthIndicator } from '../database/database-health.indicator';

@Controller('healthz')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Pings whichever database backend DB_PROVIDER selected.
      () => this.database.isHealthy('database'),
      // Fail the check if the heap is close to 1.5 GB — the orchestrator restarts us.
      () => this.memory.checkHeap('memory_heap', 1.5 * 1024 * 1024 * 1024),
    ]);
  }
}
