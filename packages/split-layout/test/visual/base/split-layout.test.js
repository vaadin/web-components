import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-split-layout.js';

describe('split-layout', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync(`
      <vaadin-split-layout style="width: 200px; height: 100px">
        <div></div>
        <div></div>
      </vaadin-split-layout>
    `);
  });

  it('horizontal', async () => {
    await visualDiff(element, 'horizontal');
  });

  it('vertical', async () => {
    element.orientation = 'vertical';
    await visualDiff(element, 'vertical');
  });

  it('small', async () => {
    element.setAttribute('theme', 'small');
    await visualDiff(element, 'horizontal-small');
  });

  it('vertical small', async () => {
    element.orientation = 'vertical';
    element.setAttribute('theme', 'small');
    await visualDiff(element, 'vertical-small');
  });
});
