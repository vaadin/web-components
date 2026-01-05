import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../not-animated-styles.js';
import '../../../vaadin-context-menu.js';
import { openSubMenus } from '../../helpers.js';

describe('context-menu', () => {
  let element;

  const contextmenu = (target) => {
    const domRect = target.getBoundingClientRect();
    const e = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: domRect.left,
      clientY: domRect.y,
    });

    target.listenOn.dispatchEvent(e);
  };

  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-context-menu>
        <div style="padding: 10px">Target</div>
      </vaadin-context-menu>
    `);
    await nextUpdate(element);
  });

  it('basic', async () => {
    element.items = [{ text: 'Item 1' }, { text: 'Item 2' }];
    contextmenu(element);
    await nextRender();
    await visualDiff(document.body, 'basic');
  });

  it('nested', async () => {
    element.items = [
      { text: 'Menu Item 1' },
      { component: 'hr' },
      {
        text: 'Menu Item 2',
        children: [
          { text: 'Menu Item 2-1' },
          {
            text: 'Menu Item 2-2',
            children: [
              { text: 'Menu Item 2-2-1', checked: true },
              { text: 'Menu Item 2-2-2', disabled: true },
              { component: 'hr' },
              { text: 'Menu Item 2-2-3' },
            ],
          },
        ],
      },
      { text: 'Menu Item 3', disabled: true },
      { text: 'Menu Item 4', theme: 'danger' },
    ];
    contextmenu(element);
    await openSubMenus(element);
    await nextRender();
    await visualDiff(document.body, 'nested');
  });
});
