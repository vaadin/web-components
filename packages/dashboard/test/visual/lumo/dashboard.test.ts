import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/props.css';
import '@vaadin/vaadin-lumo-styles/components/dashboard.css';
import '../../../vaadin-dashboard.js';
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
      element = fixtureSync(`<vaadin-dashboard></vaadin-dashboard>`, div);

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
      element.editable = true;
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, getName('focused-widget'));
    });

    it('selected widget', async () => {
      element.editable = true;
      await sendKeys({ press: 'Tab' });
      await sendKeys({ press: 'Enter' });
      await visualDiff(div, getName('selected-widget'));
    });

    it('resize mode', async () => {
      element.editable = true;
      const firstWidget = getElementFromCell(element, 0, 0)!;
      const resizeHandle = getResizeHandle(firstWidget) as HTMLElement;
      resizeHandle.click();
      await nextFrame();
      await visualDiff(div, getName('resize-mode'));
    });

    it('move mode', async () => {
      element.editable = true;
      const firstWidget = getElementFromCell(element, 0, 0)!;
      const moveHandle = getDraggable(firstWidget) as HTMLElement;
      moveHandle.click();
      await nextFrame();
      await visualDiff(div, getName('move-mode'));
    });

    it('dragged widget', async () => {
      element.editable = true;
      fireDragStart(getElementFromCell(element, 0, 0)!);
      await nextFrame();

      await visualDiff(div, getName('dragged-widget'));
    });

    it('resized widget', async () => {
      element.editable = true;
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

    it('editable', async () => {
      element.editable = true;
      await visualDiff(div, getName('editable'));
    });

    describe('long title', () => {
      beforeEach(async () => {
        element.items = [
          { colspan: 1 },
          { colspan: 1 },
          {
            title:
              'Section long title: Nunc sit amet suscipit tellus, id fermentum massa. Aliquam vel tellus cursus, sodales ligula sed, iaculis justo.',
            items: [{ colspan: 1, rowspan: 1 }, { colspan: 1 }],
          },
        ];

        element.renderer = (wrapper) => {
          render(
            html`<vaadin-dashboard-widget
              widget-title="Long title: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque ultricies lobortis orci, a faucibus tortor blandit at."
            >
              <div class="content" slot="header-content">Header content</div>
              <div class="content">Content</div>
            </vaadin-dashboard-widget>`,
            wrapper,
          );
        };

        await nextFrame();
      });

      it('title wrap', async () => {
        await nextFrame();
        await visualDiff(div, getName('title-wrap'));
      });

      it('no title wrap', async () => {
        element.style.setProperty('--vaadin-dashboard-widget-title-wrap', 'nowrap');
        await nextFrame();
        await visualDiff(div, getName('no-title-wrap'));
      });
    });

    describe('theme', () => {
      it('shaded background', async () => {
        element.setAttribute('theme', 'shaded-background');
        await visualDiff(div, getName('theme-shaded-background'));
      });

      it('elevated widgets', async () => {
        element.setAttribute('theme', 'elevated-widgets');
        await visualDiff(div, getName('theme-elevated-widgets'));
      });

      it('flat widgets', async () => {
        element.setAttribute('theme', 'flat-widgets');
        await visualDiff(div, getName('theme-flat-widgets'));
      });
    });
  });
});
