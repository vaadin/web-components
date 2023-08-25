import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
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
        <!-- Font icons using class names -->
        <vaadin-icon font="my-icon-font icon-before"></vaadin-icon>
        <vaadin-icon font="my-icon-font icon-after"></vaadin-icon>
        <vaadin-icon font="my-icon-font icon-ligature"></vaadin-icon>

        <!-- Font icons using char -->
        <vaadin-icon font="my-icon-font" char="\ue900"></vaadin-icon>
        <vaadin-icon font="my-icon-font" char="figma"></vaadin-icon>
        <vaadin-icon style="font-family: 'My icons'" char="\ue900"></vaadin-icon>

        <!-- Font icons using fontFamily -->
        <vaadin-icon font-family="My icons" char="\ue900"></vaadin-icon>
        <vaadin-icon font-family="My icons" char="figma"></vaadin-icon>
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
