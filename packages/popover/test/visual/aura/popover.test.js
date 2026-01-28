import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../not-animated-styles.js';
import '../../../vaadin-popover.js';

describe('popover', () => {
  let div, target, element;

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-popover>
        <div>This is the popover content</div>
        <div>It contains multiple lines</div>
      </vaadin-popover>
    `);
    div = fixtureSync(`
      <div style="display: flex; width: 600px; height: 600px; justify-content: center; align-items: center">
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
});
