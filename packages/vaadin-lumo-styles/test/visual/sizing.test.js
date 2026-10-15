import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../src/props/index.css';
import '../../src/global/index.css';

describe('sizing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="width: var(--lumo-size-m); height: var(--lumo-size-m);"></div>
    `);
  });

  it('default', async () => {
    await visualDiff(wrapper, 'sizing');
  });

  it('custom', async () => {
    fixtureSync(`
      <style>
        html {
          --lumo-size-m: 4rem;
        }
      </style>
    `);
    await visualDiff(wrapper, 'sizing-custom');
  });
});
