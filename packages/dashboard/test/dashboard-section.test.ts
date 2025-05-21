import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-layout.js';
import '../vaadin-dashboard-section.js';
import '../vaadin-dashboard-widget.js';
import type { DashboardLayout } from '../vaadin-dashboard-layout.js';
import { DashboardSection } from '../vaadin-dashboard-section.js';
import type { DashboardWidget } from '../vaadin-dashboard-widget.js';
import {
  assertHeadingLevel,
  getDraggable,
  getMoveApplyButton,
  getMoveBackwardButton,
  getMoveForwardButton,
  getRemoveButton,
  getTitleElement,
} from './helpers.js';

describe('dashboard section', () => {
  let section: DashboardSection & { __i18n: { [key: string]: string } };

  beforeEach(async () => {
    section = fixtureSync(`
      <vaadin-dashboard-section>
        <div id="0">Item 0</div>
        <div id="1">Item 1</div>
      </vaadin-dashboard-section>
    `);
    await nextFrame();
  });

  it('should not display when hidden', () => {
    expect(section.offsetHeight).to.be.above(0);
    section.hidden = true;
    expect(section.offsetHeight).to.eql(0);
  });

  describe('a11y', () => {
    it('should have role="section"', () => {
      expect(section.getAttribute('role')).to.eql('section');
    });

    it('should not override custom role', async () => {
      section = fixtureSync(`<vaadin-dashboard-section role="region"></vaadin-dashboard-section>`);
      await nextFrame();
      expect(section.getAttribute('role')).to.eql('region');
    });

    it('should have text content for the title', async () => {
      section.sectionTitle = 'Custom title';
      await nextFrame();
      const title = getTitleElement(section);
      expect(title?.textContent).equal('Custom title');
    });
  });

  describe('title', () => {
    it('should empty title element when cleared', async () => {
      section.sectionTitle = 'New title';
      await nextFrame();

      section.sectionTitle = null;
      await nextFrame();

      const title = getTitleElement(section);
      expect(title?.textContent).to.eql('');
    });
  });

  describe('i18n', () => {
    it('should localize focus button aria-label', async () => {
      const focusButton = section.shadowRoot?.querySelector('#focus-button');
      expect(focusButton?.getAttribute('aria-label')).to.eql('Select section for editing');

      section.__i18n = { ...section.__i18n, selectSection: 'foo' };
      await nextFrame();

      expect(focusButton?.getAttribute('aria-label')).to.eql('foo');
    });

    it('should localize remove button title', async () => {
      const removeButton = getRemoveButton(section);
      expect(removeButton?.getAttribute('title')).to.eql('Remove');

      section.__i18n = { ...section.__i18n, remove: 'foo' };
      await nextFrame();

      expect(removeButton?.getAttribute('title')).to.eql('foo');
    });

    it('should localize drag handle title', async () => {
      const dragHandle = getDraggable(section);
      expect(dragHandle?.getAttribute('title')).to.eql('Move');

      section.__i18n = { ...section.__i18n, move: 'foo' };
      await nextFrame();

      expect(dragHandle?.getAttribute('title')).to.eql('foo');
    });

    it('should localize move mode buttons', async () => {
      expect(getMoveApplyButton(section)?.getAttribute('title')).to.eql('Apply');
      expect(getMoveForwardButton(section)?.getAttribute('title')).to.eql('Move Forward');
      expect(getMoveBackwardButton(section)?.getAttribute('title')).to.eql('Move Backward');

      section.__i18n = {
        ...section.__i18n,
        moveApply: 'foo',
        moveForward: 'bar',
        moveBackward: 'baz',
      };

      await nextFrame();

      expect(getMoveApplyButton(section)?.getAttribute('title')).to.eql('foo');
      expect(getMoveForwardButton(section)?.getAttribute('title')).to.eql('bar');
      expect(getMoveBackwardButton(section)?.getAttribute('title')).to.eql('baz');
    });
  });

  describe('title heading level', () => {
    describe('with dashboard layout parent', () => {
      let layout: DashboardLayout;
      let section: DashboardSection;
      let nestedWidget: DashboardWidget;

      beforeEach(async () => {
        layout = fixtureSync(`
        <vaadin-dashboard-layout>
          <vaadin-dashboard-section section-title="Section">
            <vaadin-dashboard-widget widget-title="Nested Widget"></vaadin-dashboard-widget>
          </vaadin-dashboard-section>
        </vaadin-dashboard-layout>
      `);
        section = layout.querySelector('vaadin-dashboard-section') as DashboardSection;
        nestedWidget = section.querySelector('vaadin-dashboard-widget') as DashboardWidget;
        await nextFrame();
      });

      it('should have title heading level (2) by default', () => {
        assertHeadingLevel(section, 2);
      });

      it('should update heading level when parent dashboard layout changes', async () => {
        layout.rootHeadingLevel = 4;
        await nextFrame();
        assertHeadingLevel(section, 4);
        assertHeadingLevel(nestedWidget, 5);
      });
    });

    describe('moving between parents', () => {
      let newLayout: DashboardLayout;
      let section: DashboardSection;
      let nestedWidget: DashboardWidget;

      beforeEach(async () => {
        const container = fixtureSync(`
        <div>
          <vaadin-dashboard-layout id="layout1" root-heading-level="1">
            <vaadin-dashboard-section section-title="Section">
              <vaadin-dashboard-widget widget-title="Nested Widget"></vaadin-dashboard-widget>
            </vaadin-dashboard-section>
          </vaadin-dashboard-layout>
          <vaadin-dashboard-layout id="layout2" root-heading-level="3"></vaadin-dashboard-layout>
        </div>
      `);
        const initialLayout = container.querySelector('#layout1') as DashboardLayout;
        newLayout = container.querySelector('#layout2') as DashboardLayout;
        section = initialLayout.querySelector('vaadin-dashboard-section') as DashboardSection;
        nestedWidget = section.querySelector('vaadin-dashboard-widget') as DashboardWidget;
        await nextFrame();
      });

      it('should update heading level when moved to another dashboard layout', async () => {
        newLayout.appendChild(section);
        await nextFrame();
        assertHeadingLevel(section, 3);
        assertHeadingLevel(nestedWidget, 4);
      });

      it('should update heading level when a new widget is added', async () => {
        const newWidget = document.createElement('vaadin-dashboard-widget');
        newWidget.widgetTitle = 'New Widget';
        section.appendChild(newWidget);
        await nextFrame();
        assertHeadingLevel(newWidget, 2);
        newLayout.appendChild(section);
        await nextFrame();
        assertHeadingLevel(newWidget, 4);
      });
    });

    describe('custom section', () => {
      it('should update heading level when a custom section is used', async () => {
        class CustomSection extends DashboardSection {}
        customElements.define('custom-dashboard-section', CustomSection);
        const layout = fixtureSync(`
        <vaadin-dashboard-layout root-heading-level="5">
          <custom-dashboard-section section-title="Custom Section">
            <vaadin-dashboard-widget widget-title="Widget in Custom"></vaadin-dashboard-widget>
          </custom-dashboard-section>
        </vaadin-dashboard-layout>
      `) as DashboardLayout;
        await nextFrame();
        const customSection = layout.querySelector('custom-dashboard-section') as DashboardSection;
        const widget = customSection.querySelector('vaadin-dashboard-widget') as DashboardWidget;
        assertHeadingLevel(customSection, 5);
        assertHeadingLevel(widget, 6);
      });
    });
  });
});
