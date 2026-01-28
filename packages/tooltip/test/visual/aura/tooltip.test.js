import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import { Tooltip } from '../../../vaadin-tooltip.js';
import { mouseenter } from '../../helpers.js';

describe('tooltip', () => {
  let div, target, element;

  before(async () => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
    // Preload markdown helpers to avoid dynamic import delays
    await Tooltip.__importMarkdownHelpers();
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

  it('basic', async () => {
    element.text = 'Basic tooltip';
    await nextUpdate(element);
    mouseenter(target);
    await nextRender();
    await visualDiff(div, 'basic');
  });

  it('markdown', async () => {
    // Increase container height to fit larger tooltip content
    div.style.height = '500px';

    element.markdown = true;
    element.text = `
## Tooltip Title

This tooltip contains:

- **Bold** and *italic* text
- A [link](https://vaadin.com)
- Code: \`console.log('Hello')\``;
    await nextUpdate(element);
    mouseenter(target);
    await nextRender();
    await visualDiff(div, 'markdown');
  });
});
