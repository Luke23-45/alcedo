import { Platform } from 'react-native';

/**
 * Base URL of the Alcedo backend (v2, NestJS) — the only backend the app
 * talks to. Auth, sync, and the AI coach all go through {@link authenticatedFetch}.
 *
 * backend-v2 serves every route under the global `/api` prefix
 * (`app.setGlobalPrefix('api')`), so the prefix is part of this constant —
 * every caller appends paths like `/auth/google` and must never add `/api`
 * itself.
 *
 * Dev points at the local docker-compose stack (port 3000). The production
 * value must be set to the deployed backend-v2 URL before release builds —
 * sign-in fails fast with a clear error if the server is unreachable, it
 * never silently falls back to another backend.
 */
export const alcedoApiBaseUrl = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'
    : 'http://127.0.0.1:3000/api'
  : 'https://api.alcedo.app/api';
