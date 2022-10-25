import { fire, fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/test/autoload.js';
import '../../not-animated-styles.js';
import '../../../theme/lumo/vaadin-tooltip.js';

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
});
