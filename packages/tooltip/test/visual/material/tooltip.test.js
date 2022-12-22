import { fire, fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../not-animated-styles.js';
import '../../../theme/material/vaadin-tooltip.js';
import { colorDark } from '@vaadin/vaadin-material-styles/color.js';

describe('tooltip', () => {
  let div, target, element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-tooltip text="tooltip"></vaadin-tooltip>');
    div = fixtureSync(`
      <div style="display: flex; width: 300px; height: 300px; justify-content: center; align-items: center">
        <div style="width: 100px; height: 100px; outline: 1px solid red;"></div>
      </div>
    `);
    target = div.firstElementChild;
    element.target = target;
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
      fire(target, 'mouseenter');
      await visualDiff(div, position);
    });
  });

  describe('dark', () => {
    before(() => {
      const style = document.createElement('style');
      style.innerHTML = `${colorDark.toString().replace(':host', 'html')}`;
      document.head.appendChild(style);
      document.documentElement.setAttribute('theme', 'dark');
    });

    after(() => {
      document.documentElement.removeAttribute('theme');
    });

    it('theme-dark', async () => {
      fire(target, 'mouseenter');
      await visualDiff(div, 'theme-dark');
    });
  });

  it('max-width', async () => {
    element.text = 'This is a tooltip with a long text (more than 40 chars), it should wrap in 2 lines for readability';
    fire(target, 'mouseenter');
    await visualDiff(div, 'max-width');
  });

  it('white-space-pre', async () => {
    element.text = 'Line 1\n\nLine 2';
    fire(target, 'mouseenter');
    const overlay = document.querySelector('vaadin-tooltip-overlay');
    const content = overlay.shadowRoot.querySelector('[part="content"]');
    content.style.whiteSpace = 'pre';
    await visualDiff(div, 'white-space-pre');
  });
});
