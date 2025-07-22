import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/global.css';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/popover.css';
import '../../not-animated-styles.js';
import '../../../vaadin-popover.js';

describe('popover', () => {
  let div, target, element;

  beforeEach(async () => {
    element = fixtureSync('<vaadin-popover></vaadin-popover>');
    element.renderer = (root) => {
      root.textContent = 'Content';
    };
    div = fixtureSync(`
      <div style="display: flex; width: 300px; height: 300px; justify-content: center; align-items: center">
        <div style="width: 100px; height: 100px; outline: 1px solid red;"></div>
      </div>
    `);
    target = div.firstElementChild;
    element.target = target;
    await nextRender();
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
      await visualDiff(div, position);
    });

    it(`${position} arrow`, async () => {
      element.setAttribute('theme', 'arrow');
      element.position = position;
      await nextUpdate(element);
      target.click();
      await nextRender();
      await visualDiff(div, `${position}-arrow`);
    });
  });

  it('no-padding', async () => {
    element.setAttribute('theme', 'no-padding');
    target.click();
    await nextRender();
    await visualDiff(div, 'no-padding');
  });

  it('custom offset', async () => {
    element.style.setProperty('--vaadin-popover-offset-top', '15px');
    target.click();
    await nextRender();
    await visualDiff(div, 'custom-offset');
  });
});
