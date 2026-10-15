import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-accordion-panel.js';

describe('accordion-panel', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';

    element = fixtureSync(
      `
        <vaadin-accordion-panel summary="Panel">
          <div>Content</div>
        </vaadin-accordion-panel>
      `,
      div,
    );
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('opened', async () => {
    element.opened = true;
    await visualDiff(div, 'opened');
  });

  it('filled', async () => {
    element.setAttribute('theme', 'filled');
    await visualDiff(div, 'filled');
  });

  it('reverse', async () => {
    element.setAttribute('theme', 'reverse');
    await visualDiff(div, 'reverse');
  });

  it('no-padding', async () => {
    element.setAttribute('theme', 'no-padding');
    element.opened = true;
    await visualDiff(div, 'no-padding');
  });
});
