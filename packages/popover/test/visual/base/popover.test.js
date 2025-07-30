import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '../../../src/vaadin-popover.js';

describe('popover', () => {
  let div, target, element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-popover></vaadin-popover>');
    element.renderer = (root) => {
      root.innerHTML = `
        <div>This is the popover content</div>
        <div>It contains multiple lines</div>
      `;
    };
    div = fixtureSync(`
      <div style="display: flex; width: 600px; height: 600px; justify-content: center; align-items: center">
        <div style="width: 100px; height: 100px; outline: 1px solid red;"></div>
      </div>
    `);
    target = div.firstElementChild;
    element.target = target;
    await nextRender();
  });

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'start-top',
        'start',
        'start-bottom',
        'end-top',
        'end',
        'end-bottom',
      ].forEach((position) => {
        it(position, async () => {
          element.position = position;
          await nextUpdate(element);
          target.click();
          await nextRender();
          await visualDiff(div, `${dir}-${position}`);
        });

        it(`${position} arrow`, async () => {
          element.setAttribute('theme', 'arrow');
          element.position = position;
          await nextUpdate(element);
          target.click();
          await nextRender();
          await visualDiff(div, `${dir}-${position}-arrow`);
        });
      });
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      element.modal = true;
      target.click();
      await nextRender();
    });

    it('focus-visible', async () => {
      await visualDiff(div, 'focus-visible');
    });

    it('focus-visible-arrow', async () => {
      element.setAttribute('theme', 'arrow');
      await nextUpdate(element);
      await visualDiff(div, 'focus-visible-arrow');
    });
  });

  describe('no-padding', () => {
    before(() => {
      const contentStyles = new CSSStyleSheet();
      contentStyles.insertRule('vaadin-popover::part(content) { padding: 20px; }');
      document.adoptedStyleSheets = [contentStyles];
    });

    after(() => {
      document.adoptedStyleSheets = [];
    });

    it('no-padding', async () => {
      element.setAttribute('theme', 'no-padding');
      target.click();
      await nextRender();
      await visualDiff(div, 'no-padding');
    });
  });
});
