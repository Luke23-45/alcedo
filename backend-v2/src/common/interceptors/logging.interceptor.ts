import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Response } from 'express';
import { RequestWithId } from '../middleware/request-id.middleware';

const REDACTED = '[REDACTED]';
const SENSITIVE_KEY_PATTERN = /token|secret|password/i;

/** Redacts any body field whose name contains token/secret/password (nested too). */
function redactBody(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactBody);
  }
  if (value instanceof Buffer || value instanceof Uint8Array) {
    return '[binary]';
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      out[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : redactBody(v);
    }
    return out;
  }
  return value;
}

function redactHeaders(headers: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...headers };
  for (const key of Object.keys(out)) {
    if (key.toLowerCase() === 'authorization') {
      out[key] = REDACTED;
    }
  }
  return out;
}

/**
 * Structured per-request log: method, path, status, duration, request id.
 * Secrets are redacted before anything reaches the logs — Authorization
 * headers and body fields named *token* / *secret* / *password*.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<RequestWithId>();
    const response = http.getResponse<Response>();
    const { method, url } = request;
    const requestId = request.id ?? 'n/a';
    const startedAt = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            JSON.stringify({
              method,
              path: url,
              statusCode: response.statusCode,
              durationMs: Date.now() - startedAt,
              requestId,
              body: redactBody(request.body),
            }),
          );
        },
        error: (error: unknown) => {
          this.logger.warn(
            JSON.stringify({
              method,
              path: url,
              statusCode: response.statusCode,
              durationMs: Date.now() - startedAt,
              requestId,
              body: redactBody(request.body),
              headers: redactHeaders(request.headers as Record<string, unknown>),
              error: error instanceof Error ? error.message : 'unknown',
            }),
          );
        },
      }),
    );
  }
}
