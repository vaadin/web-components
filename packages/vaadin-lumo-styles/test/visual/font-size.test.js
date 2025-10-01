import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../src/props/index.css';
import '../../global.css';

describe('font-size', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: inline-block">
        <div style="font-size: 1.5em">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </div>
    `);
  });

  it('default', async () => {
    await visualDiff(wrapper, 'font-size');
  });

  it('custom', async () => {
    fixtureSync(`
      <style>
        html {
          --lumo-font-size-m: 1.5rem;
        }
      </style>
    `);
    await visualDiff(wrapper, 'font-size-custom');
  });
});
