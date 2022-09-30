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

    it('theme-dark', async () => {
      fire(target, 'mouseenter');
      await visualDiff(div, 'theme-dark');
    });
  });
});
