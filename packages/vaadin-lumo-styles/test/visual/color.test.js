import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../src/props/index.css';
import '../../global.css';

describe('color', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: flex; align-items: center; justify-content: center; width: 600px; height: 400px;">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </div>
    `);
  });

  it('default', async () => {
    await visualDiff(wrapper, 'color');
  });

  it('custom', async () => {
    fixtureSync(`
      <style>
        html {
          --lumo-base-color: black;
          --lumo-body-text-color: white;
        }
      </style>
    `);
    await visualDiff(wrapper, 'color-custom');
  });
});
