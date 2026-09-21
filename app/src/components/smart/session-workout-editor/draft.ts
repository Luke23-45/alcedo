import { Session } from '@/models/session-models';

/**
 * Draft semantics for the workout editor's plan name and notes.
 *
 * Name and notes are local drafts: typing never touches the store. The draft
 * commits on Save and on ordinary dismissal (back chevron, swipe-back) — only
 * an explicit Cancel discards it. Add/remove/reorder bypass the draft
 * entirely and mutate the store immediately, so they are never lost by a
 * Cancel.
 */

export type DraftDismissIntent = 'save' | 'cancel' | null;

/** Save and ordinary dismissal commit; only Cancel discards. */
export function shouldCommitDraftOnDismiss(intent: DraftDismissIntent): boolean {
  return intent !== 'cancel';
}

/**
 * Resolves the committed name from the draft. A blank draft name falls back to
 * the stored name — a plan can never be saved nameless. An untouched name
 * resolves to undefined so the stored value survives the commit.
 */
export function resolveDraftName(
  rawName: string,
  nameDirty: boolean,
  storedName: string | undefined,
): string | undefined {
  if (!nameDirty) {
    return undefined;
  }
  const trimmed = rawName.trim();
  return trimmed.length > 0 ? trimmed : storedName;
}

/**
 * Builds the store update that commits the draft. A field left `undefined`
 * was never touched and keeps its stored value.
 */
export function buildDraftCommitUpdate(name: string | undefined, notes: string | undefined) {
  return (session: Session): Session =>
    session.with({
      blueprint: session.blueprint.with({
        ...(name !== undefined ? { name } : {}),
        ...(notes !== undefined ? { notes } : {}),
      }),
    });
}
