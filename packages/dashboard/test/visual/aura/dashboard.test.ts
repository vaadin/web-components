import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-dashboard.js';
import { html, render } from 'lit';
import type { Dashboard } from '../../../vaadin-dashboard.js';
import {
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

  describe('widgets and section', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-dashboard></vaadin-dashboard>', div);

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
      await visualDiff(div, 'default');
    });

    it('focused widget', async () => {
      element.editable = true;
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focused-widget');
    });

    it('selected widget', async () => {
      element.editable = true;
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      await visualDiff(div, 'selected-widget');
    });

    it('resize mode', async () => {
      element.editable = true;
      const firstWidget = getElementFromCell(element, 0, 0)!;
      const resizeHandle = getResizeHandle(firstWidget) as HTMLElement;
      resizeHandle.click();
      await nextFrame();
      await visualDiff(div, 'resize-mode');
    });

    it('move mode', async () => {
      element.editable = true;
      const firstWidget = getElementFromCell(element, 0, 0)!;
      const moveHandle = getDraggable(firstWidget) as HTMLElement;
      moveHandle.click();
      await nextFrame();
      await visualDiff(div, 'move-mode');
    });

    it('dragged widget', async () => {
      element.editable = true;
      fireDragStart(getElementFromCell(element, 0, 0)!);
      await nextFrame();

      await visualDiff(div, 'dragged-widget');
    });

    it('resized widget', async () => {
      element.editable = true;
      fireResizeStart(getElementFromCell(element, 0, 0)!);
      await nextFrame();
      fireResizeOver(getElementFromCell(element, 0, 0)!, 'end');
      await nextFrame();

      await visualDiff(div, 'resized-widget');
    });

    it('editable', async () => {
      element.editable = true;
      await visualDiff(div, 'editable');
    });
  });
});
