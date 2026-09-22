/**
 * Bundled media assets (feed seed photos, avatars, clips).
 * Metro's asset system resolves require('./x.jpg') / require('./x.mp4') to a
 * numeric asset id at runtime; under Vitest the same import resolves to the
 * file's served URL string, so tests must only assert presence, not the type.
 */
declare module '*.jpg' {
  const value: number;
  export default value;
}
declare module '*.jpeg' {
  const value: number;
  export default value;
}
declare module '*.png' {
  const value: number;
  export default value;
}
declare module '*.mp4' {
  const value: number;
  export default value;
}
