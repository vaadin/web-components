import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-dashboard-widget.js';
import { DashboardSection } from '../src/vaadin-dashboard-section.js';
import { DashboardWidget } from '../src/vaadin-dashboard-widget.js';
import {
  assertHeadingLevel,
  getDraggable,
  getMoveApplyButton,
  getMoveBackwardButton,
  getMoveForwardButton,
  getRemoveButton,
  getResizeApplyButton,
  getResizeGrowHeightButton,
  getResizeGrowWidthButton,
  getResizeHandle,
  getResizeShrinkHeightButton,
  getResizeShrinkWidthButton,
  getTitleElement,
} from './helpers.js';

describe('dashboard widget', () => {
  let widget: DashboardWidget & { __i18n: { [key: string]: string } };

  beforeEach(async () => {
    widget = fixtureSync(`<vaadin-dashboard-widget>Widget content</vaadin-dashboard-widget>`);
    await nextFrame();
  });

  it('should not display when hidden', () => {
    expect(widget.offsetHeight).to.be.above(0);
    widget.hidden = true;
    expect(widget.offsetHeight).to.eql(0);
  });

  describe('a11y', () => {
    it('should have role="article"', () => {
      expect(widget.getAttribute('role')).to.eql('article');
    });

    it('should not override custom role', async () => {
      widget = fixtureSync(`<vaadin-dashboard-widget role="region"></vaadin-dashboard-widget>`);
      await nextFrame();
      expect(widget.getAttribute('role')).to.eql('region');
    });

    it('should have text content for the title', async () => {
      widget.widgetTitle = 'Custom title';
      await nextFrame();
      const title = getTitleElement(widget);
      expect(title?.textContent).equal('Custom title');
    });
  });

  describe('title', () => {
    it('should empty title element when cleared', async () => {
      widget.widgetTitle = 'New title';
      await nextFrame();

      widget.widgetTitle = null;
      await nextFrame();

      const title = getTitleElement(widget);
      expect(title?.textContent).to.eql('');
    });
  });

  describe('i18n', () => {
    it('should localize focus button aria-label', async () => {
      const focusButton = widget.shadowRoot?.querySelector('#focus-button');
      expect(focusButton?.getAttribute('aria-label')).to.eql('Select widget for editing');

      widget.__i18n = { ...widget.__i18n, selectWidget: 'foo' };
      await nextFrame();

      expect(focusButton?.getAttribute('aria-label')).to.eql('foo');
    });

    it('should localize remove button title', async () => {
      const removeButton = getRemoveButton(widget);
      expect(removeButton?.getAttribute('title')).to.eql('Remove');

      widget.__i18n = { ...widget.__i18n, remove: 'foo' };
      await nextFrame();

      expect(removeButton?.getAttribute('title')).to.eql('foo');
    });

    it('should localize drag handle title', async () => {
      const dragHandle = getDraggable(widget);
      expect(dragHandle?.getAttribute('title')).to.eql('Move');

      widget.__i18n = { ...widget.__i18n, move: 'foo' };
      await nextFrame();

      expect(dragHandle?.getAttribute('title')).to.eql('foo');
    });

    it('should localize resize handle title', async () => {
      const resizeHandle = getResizeHandle(widget);
      expect(resizeHandle?.getAttribute('title')).to.eql('Resize');

      widget.__i18n = { ...widget.__i18n, resize: 'foo' };
      await nextFrame();

      expect(resizeHandle?.getAttribute('title')).to.eql('foo');
    });

    it('should localize resize mode buttons', async () => {
      expect(getResizeApplyButton(widget)?.getAttribute('title')).to.eql('Apply');
      expect(getResizeShrinkHeightButton(widget)?.getAttribute('title')).to.eql('Shrink height');
      expect(getResizeShrinkWidthButton(widget)?.getAttribute('title')).to.eql('Shrink width');
      expect(getResizeGrowHeightButton(widget)?.getAttribute('title')).to.eql('Grow height');
      expect(getResizeGrowWidthButton(widget)?.getAttribute('title')).to.eql('Grow width');

      widget.__i18n = {
        ...widget.__i18n,
        resizeApply: 'foo',
        resizeShrinkHeight: 'bar',
        resizeShrinkWidth: 'baz',
        resizeGrowHeight: 'qux',
        resizeGrowWidth: 'quux',
      };

      await nextFrame();

      expect(getResizeApplyButton(widget)?.getAttribute('title')).to.eql('foo');
      expect(getResizeShrinkHeightButton(widget)?.getAttribute('title')).to.eql('bar');
      expect(getResizeShrinkWidthButton(widget)?.getAttribute('title')).to.eql('baz');
      expect(getResizeGrowHeightButton(widget)?.getAttribute('title')).to.eql('qux');
      expect(getResizeGrowWidthButton(widget)?.getAttribute('title')).to.eql('quux');
    });

    it('should localize move mode buttons', async () => {
      expect(getMoveApplyButton(widget)?.getAttribute('title')).to.eql('Apply');
      expect(getMoveForwardButton(widget)?.getAttribute('title')).to.eql('Move Forward');
      expect(getMoveBackwardButton(widget)?.getAttribute('title')).to.eql('Move Backward');

      widget.__i18n = {
        ...widget.__i18n,
        moveApply: 'foo',
        moveForward: 'bar',
        moveBackward: 'baz',
      };

      await nextFrame();

      expect(getMoveApplyButton(widget)?.getAttribute('title')).to.eql('foo');
      expect(getMoveForwardButton(widget)?.getAttribute('title')).to.eql('bar');
      expect(getMoveBackwardButton(widget)?.getAttribute('title')).to.eql('baz');
    });
  });
});

describe('widget title level', () => {
  it('should have title heading level 2 by default', async () => {
    const widget = fixtureSync(`<vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>`);
    await nextFrame();

    assertHeadingLevel(widget as DashboardWidget, 2);
  });

  it('should have title heading level 2 by default on the section', async () => {
    const section = fixtureSync(`<vaadin-dashboard-section section-title="foo"></vaadin-dashboard-section>`);
    await nextFrame();

    assertHeadingLevel(section as DashboardSection, 2);
  });

  it('should have title heading level 3 when rendered inside a section', async () => {
    const widget = fixtureSync(`
      <vaadin-dashboard-section>
        <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
      </vaadin-dashboard-section>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    assertHeadingLevel(widget, 3);
  });

  it('should have title heading level 2 after moving out of a section', async () => {
    const widget = fixtureSync(`
      <div>
        <vaadin-dashboard-section>
          <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
        </vaadin-dashboard-section>
      </div>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    const wrapper = widget.closest('div')!;
    wrapper.appendChild(widget);
    await nextFrame();

    assertHeadingLevel(widget, 2);
  });

  it('should have title heading level 3 after moving into a section', async () => {
    const widget = fixtureSync(`
      <div>
        <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
        <vaadin-dashboard-section></vaadin-dashboard-section>
      </div>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    const section = widget.nextElementSibling as DashboardSection;
    section.appendChild(widget);
    await nextFrame();

    assertHeadingLevel(widget, 3);
  });

  it('should have title heading level 3 after defining parent section', async () => {
    const widget = fixtureSync(`
      <my-custom-section>
        <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
      </my-custom-section>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    class MyCustomSection extends DashboardSection {}
    customElements.define('my-custom-section', MyCustomSection);
    await nextFrame();

    assertHeadingLevel(widget, 3);
  });

  it('should have title heading level 3 after defining the widget', async () => {
    const widget = fixtureSync(`
      <vaadin-dashboard-section>
        <my-custom-widget widget-title="foo"></my-custom-widget>
      </vaadin-dashboard-section>
    `).querySelector('my-custom-widget')!;
    await nextFrame();

    class MyCustomWidget extends DashboardWidget {}
    customElements.define('my-custom-widget', MyCustomWidget);
    await nextFrame();

    assertHeadingLevel(widget as DashboardWidget, 3);
  });

  it('should have title heading level 3 after moving a wrapped widget into a section', async () => {
    const widget = fixtureSync(`
      <div>
        <div id="wrapper">
          <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
        </div>
        <vaadin-dashboard-section></vaadin-dashboard-section>
      </div>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    const wrapper = widget.closest('div#wrapper')!;
    const section = wrapper.nextElementSibling as DashboardSection;
    section.appendChild(wrapper);
    await nextFrame();

    assertHeadingLevel(widget, 3);
  });
});
