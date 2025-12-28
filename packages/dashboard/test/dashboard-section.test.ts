import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-layout.js';
import '../vaadin-dashboard-section.js';
import '../vaadin-dashboard-widget.js';
import type { DashboardSection } from '../vaadin-dashboard-section.js';
import {
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
      expect(section.getAttribute('role')).to.eql('region');
    });

    it('should not override custom role', async () => {
      section = fixtureSync(`<vaadin-dashboard-section role="banner"></vaadin-dashboard-section>`);
      await nextFrame();
      expect(section.getAttribute('role')).to.eql('banner');
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
});
