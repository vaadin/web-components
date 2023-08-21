import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { iconFontCss } from '../test-icon-font.js';

describe('icon', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    div.style.display = 'inline-block';
  });

  describe('icon fonts', () => {
    beforeEach(async () => {
      fixtureSync(`
        <style>
          ${iconFontCss}

          vaadin-icon {
            outline: 1px solid #bbc9dc;
            width: 100px;
            height: 100px;
          }
        </style>
      `);

      fixtureSync(
        `
        <vaadin-icon class="icon-before"></vaadin-icon>
        <vaadin-icon class="icon-after"></vaadin-icon>
        <vaadin-icon class="icon-ligature"></vaadin-icon>
        `,
        div,
      );
      await nextFrame();
    });

    it('font icons', async () => {
      await visualDiff(div, 'font-icons');
    });
  });
});
