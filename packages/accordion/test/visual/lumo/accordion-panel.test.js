import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-accordion.js';

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

  it('theme reverse', async () => {
    element.setAttribute('theme', 'reverse');
    await visualDiff(div, 'theme-reverse');
  });

  it('theme filled reverse', async () => {
    element.setAttribute('theme', 'filled-reverse');
    await visualDiff(div, 'theme-filled-reverse');
  });

  describe('RTL', () => {
    before(() => {
      document.documentElement.setAttribute('dir', 'rtl');
    });

    after(() => {
      document.documentElement.removeAttribute('dir');
    });

    it('RTL basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('RTL opened', async () => {
      element.opened = true;
      await visualDiff(div, 'opened');
    });

    it('RTL theme reverse', async () => {
      element.setAttribute('theme', 'reverse');
      await visualDiff(div, 'theme-reverse');
    });

    it('RTL theme reverse filled', async () => {
      element.setAttribute('theme', 'reverse-filled');
      await visualDiff(div, 'theme-reverse-filled');
    });
  });
});
