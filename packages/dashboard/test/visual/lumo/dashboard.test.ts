import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { resetMouse, sendKeys, sendMouse } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/lumo/vaadin-dashboard.js';
import { html, render } from 'lit';
import type { Dashboard } from '../../../src/vaadin-dashboard.js';
import { describeBidirectional, getDraggable, getElementFromCell, hover } from '../../helpers.js';

describe('dashboard', () => {
  let element: Dashboard;
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';

    fixtureSync(`
      <style>
        .content {
          display: flex; 
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          height: 100%;
          padding: 5px;
          box-sizing: border-box;
        }
      </style>
    `);
  });

  describeBidirectional(`widgets and section`, () => {
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
        { title: 'Widget 1', colspan: 2 },
        { title: 'Widget 2', colspan: 1 },
        {
          title: 'Section title',
          items: [{ colspan: 1, rowspan: 2 }, { colspan: 1 }],
        },
      ];
      await nextFrame();
    });

    it('default', async () => {
      await visualDiff(div, `${document.dir}-default`);
    });

    it('focused widget', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, `${document.dir}-focused-widget`);
    });

    it('selected widget', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      await visualDiff(div, `${document.dir}-selected-widget`);
    });

    it('resize mode', async () => {
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      // Focus the remove button
      await sendKeys({ press: 'Tab' });
      // Focus the resize button
      await sendKeys({ press: 'Tab' });
      // Enter resize mode
      await sendKeys({ press: 'Enter' });

      await visualDiff(div, `${document.dir}-resize-mode`);
    });

    it('dragged widget', async () => {
      await resetMouse();
      // Hover over the widget drag handle
      await hover(getDraggable(getElementFromCell(element, 0, 0)!));
      // Press down the left mouse button
      await sendMouse({
        type: 'down',
      });
      // Move the mouse a bit
      await sendMouse({
        type: 'move',
        position: [100, 100],
      });

      await visualDiff(div, `${document.dir}-dragged-widget`);
    });

    it('no spacing', async () => {
      element.style.setProperty('--vaadin-dashboard-spacing', '0px');
      await nextFrame();
      await visualDiff(div, `${document.dir}-no-spacing`);
    });
  });
});
