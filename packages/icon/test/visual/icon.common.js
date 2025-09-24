import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { Iconset } from '../../vaadin-iconset.js';
import { iconFontCss } from '../test-icon-font.js';

describe('icon', () => {
  let div;

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

          vaadin-icon[icon] {
            outline: 1px solid #bbc9dc;
            width: 100px;
            height: 100px;
          }
        </style>
      `);

      fixtureSync(
        `
        <!-- Font icons using icon class -->
        <vaadin-icon icon-class="my-icon-font icon-before"></vaadin-icon>
        <vaadin-icon icon-class="my-icon-font icon-after"></vaadin-icon>
        <vaadin-icon icon-class="my-icon-font icon-ligature"></vaadin-icon>

        <!-- Font icons using char and ligature -->
        <vaadin-icon icon-class="my-icon-font" char="e900"></vaadin-icon>
        <vaadin-icon icon-class="my-icon-font" ligature="figma"></vaadin-icon>
        <vaadin-icon style="font-family: 'My icons'" char="e900"></vaadin-icon>

        <!-- Font icons using fontFamily -->
        <vaadin-icon font-family="My icons" char="\ue900"></vaadin-icon>
        <vaadin-icon font-family="My icons" ligature="figma"></vaadin-icon>
        `,
        div,
      );
      await nextFrame();
    });

    it('font icons', async () => {
      await visualDiff(div, 'font-icons');
    });

    it('font icons visual size', async () => {
      div.style.setProperty('--vaadin-icon-visual-size', '24px');
      await visualDiff(div, 'font-icons-visual-size');
    });
  });

  describe('svg icon', () => {
    const template = document.createElement('template');
    template.innerHTML = `
      <svg viewBox="0 0 24 24">
        <defs>
          <g id="lucide:layers" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
            <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
            <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
          </g>
        </defs>
      </svg>
    `;

    Iconset.register('lucide', 24, template);

    beforeEach(async () => {
      fixtureSync(`<vaadin-icon icon="lucide:layers"></vaadin-icon>`, div);
      await nextFrame();
    });

    it('svg icon', async () => {
      await visualDiff(div, 'svg-icon');
    });

    it('svg icon size', async () => {
      div.style.setProperty('--vaadin-icon-size', '32px');
      await visualDiff(div, 'svg-icon-size');
    });

    it('svg icon visual size', async () => {
      div.style.setProperty('--vaadin-icon-visual-size', '32px');
      await visualDiff(div, 'svg-icon-visual-size');
    });

    it('svg icon stroke width', async () => {
      div.style.setProperty('--vaadin-icon-stroke-width', '2px');
      await visualDiff(div, 'svg-icon-stroke-width');
    });
  });
});
