import { FeaturesController } from './features.controller';

describe('FeaturesController', () => {
  it('advertises the exact feature map clients probe for', () => {
    const controller = new FeaturesController();
    expect(controller.getFeatures()).toEqual({
      feed: false,
      aiPlanner: true,
      backup: false,
      sharing: false,
      sync: true,
    });
  });

  it('returns only booleans so the client probe can parse it', () => {
    const controller = new FeaturesController();
    for (const value of Object.values(controller.getFeatures())) {
      expect(typeof value).toBe('boolean');
    }
  });
});
