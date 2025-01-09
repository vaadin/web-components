import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-dashboard.js';
import { html, render } from 'lit';
import type { Dashboard } from '../../../src/vaadin-dashboard.js';
import {
  describeBidirectional,
  fireDragStart,
  fireResizeOver,
  fireResizeStart,
  getDraggable,
  getElementFromCell,
  getResizeHandle,
} from '../../helpers.js';

describe('dashboard', () => {
  let focusElement: HTMLInputElement;
  let element: Dashboard;
  let div: HTMLDivElement;

  beforeEach(() => {
    div = document.createElement('div');

    fixtureSync(`
      <style>
        .content {
          display: flex; 
          justify-content: center;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 4px;
          height: 100%;
          padding: 5px;
          box-sizing: border-box;
        }
      </style>
    `);

    focusElement = fixtureSync(`<input type="text" />`);
    focusElement.focus();
  });

  describeBidirectional(`widgets and section`, () => {
    function getName(name: string) {
      return `${document.dir || 'ltr'}-${name}`;
    }

    beforeEach(async () => {
      element = fixtureSync(`<vaadin-dashboard editable></vaadin-dashboard>`, div);

      element.renderer = (wrapper) => {
        render(
          html`<vaadin-dashboard-widget widget-title="Widget title">
            <div class="content" slot="header-content">Header content</div>
            <div class="content">Content</div>
          </vaadin-dashboard-widget>`,
          wrapper,
        );
      };

      element.items = [
        { title: 'Widget 1', colspan: 1 },
        { title: 'Widget 2', colspan: 1 },
        {
          title: 'Section title',
          items: [{ colspan: 1, rowspan: 1 }, { colspan: 1 }],
        },
      ];
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, getName('default'));
    });

    it('focused widget', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, getName('focused-widget'));
    });

    it('selected widget', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      await visualDiff(div, getName('selected-widget'));
    });

    it('resize mode', async () => {
      const firstWidget = getElementFromCell(element, 0, 0)!;
      const resizeHandle = getResizeHandle(firstWidget) as HTMLElement;
      resizeHandle.click();
      await nextFrame();
      await visualDiff(div, getName('resize-mode'));
    });

    it('move mode', async () => {
      const firstWidget = getElementFromCell(element, 0, 0)!;
      const moveHandle = getDraggable(firstWidget) as HTMLElement;
      moveHandle.click();
      await nextFrame();
      await visualDiff(div, getName('move-mode'));
    });

    it('dragged widget', async () => {
      fireDragStart(getElementFromCell(element, 0, 0)!);
      await nextFrame();

      await visualDiff(div, getName('dragged-widget'));
    });

    it('resized widget', async () => {
      fireResizeStart(getElementFromCell(element, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(element, 0, 0)!, 'end');
      await nextFrame();

      await visualDiff(div, getName('resized-widget'));
    });

    it('no gap', async () => {
      element.style.setProperty('--vaadin-dashboard-gap', '0px');
      await nextFrame();
      await visualDiff(div, getName('no-gap'));
    });

    it('non-editable', async () => {
      element.editable = false;
      await visualDiff(div, getName('non-editable'));
    });
  });
});
