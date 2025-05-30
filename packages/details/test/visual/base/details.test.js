import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-details.js';

describe('details', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';

    element = fixtureSync(
      `
      <vaadin-details>
        <vaadin-details-summary slot="summary">Summary</vaadin-details-summary>
        <span>Content</span>
      </vaadin-details>
      `,
      div,
    );
  });

  describe('default', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('opened', async () => {
      element.opened = true;
      await visualDiff(div, 'opened');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('disabled opened', async () => {
      element.opened = true;
      element.disabled = true;
      await visualDiff(div, 'disabled-opened');
    });
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
