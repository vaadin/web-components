import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { Tooltip } from '../../../src/vaadin-tooltip.js';
import { mouseenter } from '../../helpers.js';

describe('tooltip', () => {
  let div, target, element;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(() => {
    element = fixtureSync('<vaadin-tooltip text="tooltip"></vaadin-tooltip>');
    div = fixtureSync(`
      <div style="display: flex; width: 350px; height: 350px; justify-content: center; align-items: center">
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
      await nextUpdate(element);
      mouseenter(target);
      await nextRender();
      await visualDiff(div, position);
    });
  });

  it('max-width', async () => {
    element.text = 'This is a tooltip with a long text (more than 40 chars), it should wrap in 2 lines for readability';
    await nextUpdate(element);
    mouseenter(target);
    await nextRender();
    await visualDiff(div, 'max-width');
  });

  it('white-space-pre', async () => {
    element.text = 'Line 1\n\nLine 2';
    await nextUpdate(element);
    mouseenter(target);
    await nextRender();
    await visualDiff(div, 'white-space-pre');
  });

  it('markdown', async () => {
    // Increase container height to fit larger tooltip content
    div.style.height = '500px';

    // Preload markdown helpers to avoid dynamic import delays
    await element.__importMarkdownHelpers();

    element.markdown = true;
    element.text = `
## Tooltip Title

**Important:** This tooltip contains:

- **Bold** and *italic* text
- A [link](https://vaadin.com)
- Code: \`console.log('Hello')\``;
    await nextUpdate(element);
    mouseenter(target);
    await nextRender();
    await visualDiff(div, 'markdown');
  });
});
