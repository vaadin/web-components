import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../props.css';
import '../../global.css';

describe('spacing', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="width: 600px">
        <div style="margin-block: var(--lumo-space-m);">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
        <div style="margin-block: var(--lumo-space-m);">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </div>
    `);
  });

  it('default', async () => {
    await visualDiff(wrapper, 'spacing');
  });

  it('custom', async () => {
    fixtureSync(`
      <style>
        html {
          --lumo-space-m: 4rem;
        }
      </style>
    `);
    await visualDiff(wrapper, 'spacing-custom');
  });
});
