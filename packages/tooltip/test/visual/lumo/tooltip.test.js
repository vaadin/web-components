import { fire, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/tooltip.css';
import '../../not-animated-styles.js';
import { Tooltip } from '../../../vaadin-tooltip.js';

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
      await nextUpdate(element);
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
      await nextUpdate(element);
      fire(target, 'mouseenter');
      await visualDiff(div, 'theme-dark');
    });
  });

  it('max-width', async () => {
    element.text = 'This is a tooltip with a long text (more than 40 chars), it should wrap in 2 lines for readability';
    await nextUpdate(element);
    fire(target, 'mouseenter');
    await visualDiff(div, 'max-width');
  });

  it('white-space-pre', async () => {
    element.text = 'Line 1\n\nLine 2';
    await nextUpdate(element);
    fire(target, 'mouseenter');
    await visualDiff(div, 'white-space-pre');
  });

  it('custom offset', async () => {
    element.style.setProperty('--vaadin-tooltip-offset-top', '15px');
    await nextUpdate(element);
    fire(target, 'mouseenter');
    await visualDiff(div, 'custom-offset');
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
    fire(target, 'mouseenter');
    await visualDiff(div, 'markdown');
  });
});
