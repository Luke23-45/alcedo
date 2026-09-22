import { KeywordTopicGuard } from './keyword-topic-guard.service';

describe('KeywordTopicGuard', () => {
  const guard = new KeywordTopicGuard();

  describe('in-scope fitness content', () => {
    it.each([
      'How should I program progressive overload for squats?',
      'How much protein should I eat per day while bulking?',
      'Is zone 2 cardio good for recovery between lifting days?',
      "I have terrible DOMS after yesterday's leg workout — what helps?",
      'Can you write me a 5/3/1 program for the next cycle?',
      'Check my deadlift form — my lower back rounds off the floor.',
      'Is creatine worth taking every day?',
      'How do I improve my sleep for better recovery?',
    ])('classifies as in-scope: %s', async (text) => {
      const verdict = await guard.classify(text);
      expect(verdict.verdict).toBe('in-scope');
      expect(verdict.matched.length).toBeGreaterThan(0);
    });
  });

  describe('off-topic content', () => {
    it.each([
      'Should I invest in the stock market right now?',
      'Is bitcoin a good buy at these prices?',
      'Debug this python script for me, it throws a TypeError.',
      'I want to file a lawsuit against my landlord.',
      'Who do you think will win the election?',
      'My girlfriend broke up with me — what should I do?',
      'Can you do my math homework? Solve for x.',
    ])('classifies as off-topic: %s', async (text) => {
      const verdict = await guard.classify(text);
      expect(verdict.verdict).toBe('off-topic');
      expect(verdict.selfHarm).not.toBe(true);
    });

    it('reports the matched off-topic signals', async () => {
      const verdict = await guard.classify('Should I invest in bitcoin?');
      expect(verdict.verdict).toBe('off-topic');
      expect(verdict.matched.some((m) => m.startsWith('off-topic:'))).toBe(true);
    });
  });

  describe('ambiguous content proceeds (never false-block)', () => {
    it.each([
      'thanks',
      'ok',
      'hello!',
      'got it',
    ])('treats short acknowledgements as ambiguous: %s', async (text) => {
      const verdict = await guard.classify(text);
      expect(verdict.verdict).toBe('ambiguous');
    });

    it('treats mixed fitness + off-topic signals as ambiguous', async () => {
      const verdict = await guard.classify('Should I buy bitcoin or more protein powder?');
      expect(verdict.verdict).toBe('ambiguous');
      expect(verdict.matched.some((m) => m.startsWith('in-scope:'))).toBe(true);
      expect(verdict.matched.some((m) => m.startsWith('off-topic:'))).toBe(true);
    });

    it('does not block the name "Ira" (former finance false positive)', async () => {
      const verdict = await guard.classify('My name is Ira');
      expect(verdict.verdict).not.toBe('off-topic');
    });
  });

  describe('self-harm', () => {
    it('flags self-harm content for the dedicated safe path', async () => {
      const verdict = await guard.classify('I want to kill myself');
      expect(verdict.selfHarm).toBe(true);
      // Never surfaced as a plain topic block.
      expect(verdict.verdict).not.toBe('off-topic');
    });
  });

  describe('admin extra in-scope terms (ai.guardrails)', () => {
    function guardWithTerms(guardrails: string | null) {
      const aiConfig = {
        getGuardrails: jest.fn().mockResolvedValue(guardrails),
      } as unknown as import('../ai-config.service').AiConfigService;
      return new KeywordTopicGuard(aiConfig);
    }

    it('treats a message matching an admin term as in-scope', async () => {
      const guard = guardWithTerms(JSON.stringify({ extraInScope: ['kettlebell'] }));

      const verdict = await guard.classify('Should I buy a kettlebell?');

      expect(verdict.verdict).toBe('in-scope');
      expect(verdict.matched.some((m) => m === 'in-scope:admin:kettlebell')).toBe(true);
    });

    it('ignores a malformed ai.guardrails value and classifies normally', async () => {
      const guard = guardWithTerms('not json at all {{{');

      const verdict = await guard.classify('Should I buy a kettlebell?');

      // "kettlebell" is not in the built-in vocabulary; without admin terms it
      // has no signal either way and stays ambiguous — the backstop proceeds.
      expect(verdict.verdict).toBe('ambiguous');
    });

    it('never lets admin terms suppress an off-topic signal', async () => {
      const guard = guardWithTerms(JSON.stringify({ extraInScope: ['stocks'] }));

      const verdict = await guard.classify('Should I buy stocks or crypto for my portfolio?');

      // Mixed signals stay ambiguous (proceed to the model + output checks);
      // the off-topic signal is still reported, never hidden.
      expect(verdict.matched.some((m) => m.startsWith('off-topic:'))).toBe(true);
      expect(verdict.verdict).not.toBe('in-scope');
    });

    it('works without an AiConfigService (direct construction)', async () => {
      const verdict = await new KeywordTopicGuard().classify('How do I bench press?');
      expect(verdict.verdict).toBe('in-scope');
    });
  });
});
