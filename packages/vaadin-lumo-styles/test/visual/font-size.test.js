import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../autoload.js';

describe('font-size', () => {
  let wrapper;

  before(async () => {
    wrapper = fixtureSync(`
      <div style="display: flex; flex-wrap: wrap; width: 600px">
        <style>
          html {
            --lumo-font-size-m: 1.5rem;
          }
        </style>
        <span id="test" style="font-size: 1.5em">Font size 1.5em</span>
        <span id="test">Using font size 1.5rem from html definition</span>
      </div>
    `);
    await nextFrame();
  });

  it('basic', async () => {
    await visualDiff(wrapper, 'font-size');
  });
});
