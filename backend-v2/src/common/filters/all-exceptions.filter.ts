import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

/**
 * Coded-error convention: every error response is
 *   { error: { code, message, details? } }
 *
 * Other modules throw HttpExceptions whose response object carries a `code`
 * field, e.g.
 *   throw new UnauthorizedException({ code: 'AUTH_REFRESH_INVALID', message: 'Refresh token is invalid or expired.' });
 * and this filter picks the code up verbatim. When no code is supplied the
 * filter derives one from the HTTP status (BAD_REQUEST, UNAUTHORIZED, ...).
 * Non-HTTP exceptions become a generic INTERNAL_ERROR — the real stack is
 * logged server-side and never sent to the client.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ method?: string; url?: string; id?: string }>();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Something went wrong. Please try again.';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body !== null && typeof body === 'object') {
        const b = body as Record<string, unknown>;
        if (typeof b.code === 'string' && b.code.length > 0) {
          code = b.code;
        } else {
          code = this.codeForStatus(status);
        }
        if (Array.isArray(b.message)) {
          // ValidationPipe failures: the message is the constraint list.
          details = b.message;
          message = 'Validation failed.';
        } else if (typeof b.message === 'string') {
          message = b.message;
        }
        if (b.details !== undefined) {
          details = b.details;
        }
      } else {
        code = this.codeForStatus(status);
      }
    } else {
      // Unknown error: generic message to the client, full stack in the logs.
      this.logger.error(
        `Unhandled error on ${request.method ?? '?'} ${request.url ?? '?'} ` +
          `(requestId=${request.id ?? 'n/a'})`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method ?? '?'} ${request.url ?? '?'} -> ${status} ${code} ` +
          `(requestId=${request.id ?? 'n/a'}): ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    const payload: { error: { code: string; message: string; details?: unknown } } = {
      error: { code, message },
    };
    if (details !== undefined) {
      payload.error.details = details;
    }
    httpAdapter.reply(response, payload, status);
  }

  private codeForStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return status >= 500 ? 'INTERNAL_ERROR' : 'HTTP_ERROR';
    }
  }
}
