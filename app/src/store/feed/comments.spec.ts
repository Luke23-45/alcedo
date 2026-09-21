import { describe, expect, it } from 'vitest';
import commentsReducer, {
  addComment,
  alexPostSeed,
  ensurePostSeeded,
  referenceKudosSeed,
  removePostData,
  selectPostKudos,
  selectReplies,
  selectTopLevelComments,
  toggleCommentKudos,
  togglePostKudos,
} from './comments';

const POST = 'post-alex';
const PUBLISHED_AT = 1_750_000_000_000;

function seeded() {
  return commentsReducer(undefined, ensurePostSeeded({ postId: POST, seed: alexPostSeed(POST, PUBLISHED_AT) }));
}

/** Selectors take the slice state; cast the wrapper like the sibling specs do. */
function wrap(state: ReturnType<typeof commentsReducer>) {
  return { feedComments: state } as never;
}

describe('alexPostSeed', () => {
  it('anchors the contract thread to the publish time', () => {
    const seed = alexPostSeed(POST, PUBLISHED_AT);
    const byAuthor = Object.fromEntries(seed.comments.map((c) => [c.authorId, c]));
    expect(byAuthor['mia']!.createdAt).toBe(PUBLISHED_AT + 5 * 60_000);
    expect(byAuthor['jon']!.createdAt).toBe(PUBLISHED_AT + 9 * 60_000);
    expect(byAuthor['sofia']!.createdAt).toBe(PUBLISHED_AT + 17 * 60_000);
    expect(seed.kudos).toEqual({ kudoed: false, total: 6, people: ['mia', 'jon', 'sofia'] });
  });

  it('nests Alex\u2019s reply under Mia\u2019s comment', () => {
    const seed = alexPostSeed(POST, PUBLISHED_AT);
    const mia = seed.comments.find((c) => c.authorId === 'mia')!;
    const reply = seed.comments.find((c) => c.parentId !== null)!;
    expect(reply.authorId).toBe('alex');
    expect(reply.parentId).toBe(mia.id);
    expect(reply.createdAt).toBe(PUBLISHED_AT + 11 * 60_000);
  });

  it('matches the contract kudos: Mia 2, Jon 5 (kudoed), Sofia 1', () => {
    const seed = alexPostSeed(POST, PUBLISHED_AT);
    const byAuthor = Object.fromEntries(seed.comments.map((c) => [c.authorId, c]));
    expect([byAuthor['mia']!.kudos, byAuthor['mia']!.kudoed]).toEqual([2, false]);
    expect([byAuthor['jon']!.kudos, byAuthor['jon']!.kudoed]).toEqual([5, true]);
    expect([byAuthor['sofia']!.kudos, byAuthor['sofia']!.kudoed]).toEqual([1, false]);
  });
});

describe('ensurePostSeeded', () => {
  it('is idempotent: a second seed changes nothing', () => {
    const once = seeded();
    const twice = commentsReducer(once, ensurePostSeeded({ postId: POST, seed: alexPostSeed(POST, PUBLISHED_AT) }));
    expect(twice).toEqual(once);
  });

  it('does not clobber user state once seeded', () => {
    let state = seeded();
    state = commentsReducer(state, togglePostKudos(POST));
    const reseeded = commentsReducer(state, ensurePostSeeded({ postId: POST, seed: alexPostSeed(POST, PUBLISHED_AT) }));
    expect(selectPostKudos(wrap(reseeded), POST)).toEqual({
      kudoed: true,
      total: 7,
      people: ['alex', 'mia', 'jon', 'sofia'],
    });
  });
});

describe('comment selectors', () => {
  it('counts top-level comments only — replies never count', () => {
    const state = seeded();
    const top = selectTopLevelComments(wrap(state), POST);
    expect(top.map((c) => c.authorId)).toEqual(['mia', 'jon', 'sofia']);
  });

  it('returns replies oldest-first under their parent', () => {
    const state = seeded();
    const mia = selectTopLevelComments(wrap(state), POST)[0]!;
    const replies = selectReplies(wrap(state), mia.id);
    expect(replies.map((c) => c.authorId)).toEqual(['alex']);
  });
});

describe('addComment', () => {
  it('posts a top-level comment immediately', () => {
    let state = seeded();
    state = commentsReducer(state, addComment({ postId: POST, authorId: 'alex', text: 'Congrats!', parentId: null }));
    const top = selectTopLevelComments(wrap(state), POST);
    expect(top).toHaveLength(4);
    expect(top[3]).toMatchObject({ authorId: 'alex', text: 'Congrats!', parentId: null, kudos: 0 });
  });

  it('nests a reply under its parent without growing the top-level count', () => {
    let state = seeded();
    const jon = selectTopLevelComments(wrap(state), POST).find((c) => c.authorId === 'jon')!;
    state = commentsReducer(state, addComment({ postId: POST, authorId: 'alex', text: 'Haha', parentId: jon.id }));
    expect(selectTopLevelComments(wrap(state), POST)).toHaveLength(3);
    expect(selectReplies(wrap(state), jon.id).map((c) => c.text)).toEqual(['Haha']);
  });
});

describe('toggleCommentKudos', () => {
  it('toggles kudos and the kudoed flag', () => {
    let state = seeded();
    const mia = selectTopLevelComments(wrap(state), POST)[0]!;
    state = commentsReducer(state, toggleCommentKudos(mia.id));
    let updated = selectTopLevelComments(wrap(state), POST)[0]!;
    expect([updated.kudos, updated.kudoed]).toEqual([3, true]);
    state = commentsReducer(state, toggleCommentKudos(mia.id));
    updated = selectTopLevelComments(wrap(state), POST)[0]!;
    expect([updated.kudos, updated.kudoed]).toEqual([2, false]);
  });
});

describe('togglePostKudos', () => {
  it('kudos once: total 6 → 7 with Alex first in the display order', () => {
    let state = seeded();
    state = commentsReducer(state, togglePostKudos(POST));
    expect(selectPostKudos(wrap(state), POST)).toEqual({
      kudoed: true,
      total: 7,
      people: ['alex', 'mia', 'jon', 'sofia'],
    });
  });

  it('unkudos: total back to 6 with Alex removed', () => {
    let state = seeded();
    state = commentsReducer(state, togglePostKudos(POST));
    state = commentsReducer(state, togglePostKudos(POST));
    expect(selectPostKudos(wrap(state), POST)).toEqual({
      kudoed: false,
      total: 6,
      people: ['mia', 'jon', 'sofia'],
    });
  });
});

describe('referenceKudosSeed', () => {
  it('seeds kudos metadata with no comments', () => {
    const state = commentsReducer(
      undefined,
      ensurePostSeeded({
        postId: 'post-mia',
        seed: { comments: [], kudos: referenceKudosSeed(14, ['alex', 'jon', 'sofia']) },
      }),
    );
    expect(selectPostKudos(wrap(state), 'post-mia')).toEqual({
      kudoed: false,
      total: 14,
      people: ['alex', 'jon', 'sofia'],
    });
    expect(selectTopLevelComments(wrap(state), 'post-mia')).toEqual([]);
  });
});

describe('removePostData', () => {
  it('clears comments, kudos, and the seeded flag', () => {
    let state = seeded();
    state = commentsReducer(state, removePostData(POST));
    expect(selectTopLevelComments(wrap(state), POST)).toEqual([]);
    expect(selectPostKudos(wrap(state), POST)).toBeUndefined();
    // A later seed applies cleanly again.
    state = commentsReducer(state, ensurePostSeeded({ postId: POST, seed: alexPostSeed(POST, PUBLISHED_AT) }));
    expect(selectTopLevelComments(wrap(state), POST)).toHaveLength(3);
  });
});
