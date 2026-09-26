import { aiContracts } from './ai.contract';
import { postgresContext, type ProviderContext } from './harness';
import { authContracts, paymentsContracts, siteConfigContracts } from './infra.contract';
import { socialContracts } from './social.contract';
import { userContracts } from './user.contract';
import { workoutContracts } from './workout.contract';

describe('repository parity — postgres', () => {
  let ctx: ProviderContext;
  const get = () => ctx.bundle;

  beforeAll(async () => {
    ctx = await postgresContext();
  }, 120000);

  afterAll(async () => {
    await ctx.close();
  });

  beforeEach(async () => {
    await ctx.bundle.reset();
  });

  userContracts(get);
  workoutContracts(get);
  socialContracts(get);
  aiContracts(get);
  authContracts(get);
  paymentsContracts(get);
  siteConfigContracts(get);
});
