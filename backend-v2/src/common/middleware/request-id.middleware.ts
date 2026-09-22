import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

export interface RequestWithId extends Request {
  id: string;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Assigns every request a UUID (req.id) and echoes it back as X-Request-Id.
 * An incoming X-Request-Id is honored only if it is a well-formed UUID, so a
 * client cannot inject an arbitrary correlation id. Applied via app.use() in
 * main.ts so it runs before guards, interceptors, and filters.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header('x-request-id');
  const id = incoming !== undefined && UUID_PATTERN.test(incoming) ? incoming : randomUUID();
  (req as RequestWithId).id = id;
  res.setHeader('X-Request-Id', id);
  next();
}
