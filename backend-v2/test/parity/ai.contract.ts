import type { RepositoryBundle } from './harness';

const SUB = 'parity-ai-sub';
const OTHER = 'parity-ai-other';

export function aiContracts(get: () => RepositoryBundle): void {
  describe('ConversationRepository parity', () => {
    it('creates, reads, and enforces ownership', async () => {
      const { conversations } = get();
      const conv = await conversations.create(SUB, 'First chat');
      expect(conv.userId).toBe(SUB);
      expect(conv.title).toBe('First chat');
      expect(conv.messageCount).toBe(0);

      expect((await conversations.findOwned(conv.id, SUB))!.id).toBe(conv.id);
      expect(await conversations.findOwned(conv.id, OTHER)).toBeNull();
      expect(await conversations.deleteOwned(conv.id, OTHER)).toBe(false);
      expect(await conversations.deleteOwned(conv.id, SUB)).toBe(true);
      expect(await conversations.findOwned(conv.id, SUB)).toBeNull();
    });

    it('lists newest first with an opaque cursor', async () => {
      const { conversations } = get();
      const c1 = await conversations.create(SUB, 'one');
      await new Promise((r) => setTimeout(r, 15));
      await conversations.create(SUB, 'two');

      const page1 = await conversations.listForUser(SUB, 1);
      expect(page1.items.map((c) => c.id)).toEqual([page1.items[0].id]);
      expect(page1.items[0].title).toBe('two');
      expect(page1.nextCursor).not.toBeNull();

      const page2 = await conversations.listForUser(SUB, 10, page1.nextCursor!);
      expect(page1.nextCursor).not.toBeNull();
      expect(page2.items.map((c) => c.id)).toEqual([c1.id]);
      expect(page2.nextCursor).toBeNull();

      // Other users' conversations never leak in.
      const other = await conversations.listForUser(OTHER, 10);
      expect(other.items).toEqual([]);
    });

    it('sets the title only when empty and counts messages', async () => {
      const { conversations } = get();
      const conv = await conversations.create(SUB);
      await conversations.setTitleIfEmpty(conv.id, 'Auto title');
      expect((await conversations.findOwned(conv.id, SUB))!.title).toBe('Auto title');
      await conversations.setTitleIfEmpty(conv.id, 'Ignored');
      expect((await conversations.findOwned(conv.id, SUB))!.title).toBe('Auto title');

      await conversations.incrementMessageCount(conv.id, 2);
      expect((await conversations.findOwned(conv.id, SUB))!.messageCount).toBe(2);
    });
  });

  describe('MessageRepository parity', () => {
    it('stores history oldest-first with a cap', async () => {
      const { conversations, messages } = get();
      const conv = await conversations.create(SUB);
      await messages.create({
        conversationId: conv.id,
        userId: SUB,
        role: 'user',
        content: 'hi',
      });
      await messages.create({
        conversationId: conv.id,
        userId: SUB,
        role: 'assistant',
        content: 'hello',
        usage: { promptTokens: 5, completionTokens: 7, model: 'coach-primary' },
      });

      const history = await messages.history(conv.id, 10);
      expect(history.map((m) => m.role)).toEqual(['user', 'assistant']);
      expect(history[1].usage!.promptTokens).toBe(5);

      const capped = await messages.history(conv.id, 1);
      expect(capped).toHaveLength(1);
    });

    it('deletes a conversation worth of messages', async () => {
      const { conversations, messages } = get();
      const conv = await conversations.create(SUB);
      await messages.create({ conversationId: conv.id, userId: SUB, role: 'user', content: 'x' });
      await messages.deleteByConversation(conv.id);
      expect(await messages.history(conv.id, 10)).toEqual([]);
    });
  });

  describe('AiUsageRepository parity', () => {
    it('records usage without throwing', async () => {
      const { aiUsage } = get();
      await aiUsage.record({
        userId: SUB,
        conversationId: 'conv-1',
        messageId: 'msg-1',
        promptTokens: 10,
        completionTokens: 20,
        costUsd: 0.001,
        skillNames: ['program-design'],
      });
    });
  });

  describe('AiDailyUsageRepository parity', () => {
    it('increments atomically and purges old rows', async () => {
      const { aiDailyUsage } = get();
      expect(await aiDailyUsage.incrementAndGet(SUB, '2026-09-26')).toBe(1);
      expect(await aiDailyUsage.incrementAndGet(SUB, '2026-09-26')).toBe(2);
      expect(await aiDailyUsage.incrementAndGet(SUB, '2026-09-27')).toBe(1);

      // A cutoff before creation purges nothing; a later one purges all.
      expect(await aiDailyUsage.purgeBefore(new Date(Date.now() - 60000))).toBe(0);
      const later = new Date(Date.now() + 1000);
      expect(await aiDailyUsage.purgeBefore(later)).toBe(2);
    });
  });
}
