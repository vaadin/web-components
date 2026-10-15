import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-accordion-panel.js';

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

  it('focused', async () => {
    await sendKeys({ press: 'Tab' });
    await visualDiff(div, 'focused');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL basic', async () => {
      await visualDiff(div, 'rtl-basic');
    });

    it('RTL opened', async () => {
      element.opened = true;
      await visualDiff(div, 'rtl-opened');
    });
  });
});
