import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-widget.js';
import type { DashboardWidget } from '../vaadin-dashboard-widget.js';

describe('dashboard widget', () => {
  let widget: DashboardWidget;

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

    it('should add title id to aria-labelledby attribute when using property', async () => {
      widget.widgetTitle = 'Custom title';
      await nextFrame();
      const title = widget.querySelector('[slot="title"]');
      expect(widget.getAttribute('aria-labelledby')).equal(title?.id);
    });

    it('should add title id to aria-labelledby attribute when using slot', async () => {
      const title = document.createElement('div');
      title.id = 'custom-title';
      title.slot = 'title';
      title.textContent = 'Custom title';
      widget.appendChild(title);

      await nextFrame();
      expect(widget.getAttribute('aria-labelledby')).equal(title?.id);
    });

    it('should have text content for the title', async () => {
      widget.widgetTitle = 'Custom title';
      await nextFrame();
      const title = widget.querySelector('[slot="title"]');
      expect(title?.textContent).equal('Custom title');
    });
  });

  describe('title', () => {
    it('should not override custom title element', async () => {
      const title = document.createElement('div');
      title.id = 'custom-title';
      title.slot = 'title';
      title.textContent = 'Custom title';
      widget.appendChild(title);
      await nextFrame();

      widget.widgetTitle = 'New title';
      await nextFrame();

      const titles = widget.querySelectorAll('[slot="title"]');
      expect(titles.length).to.eql(1);
      expect(titles[0]).to.eql(title);
      expect(titles[0].textContent).to.eql('Custom title');
    });

    it('should not throw when initialized with a custom title', async () => {
      expect(() => {
        fixtureSync(`
          <vaadin-dashboard-widget>
            <div slot="title">Custom title</div>
          </vaadin-dashboard-widget>
        `);
      }).not.to.throw(Error);
      await nextFrame();
    });

    it('should empty title element when cleared', async () => {
      widget.widgetTitle = 'New title';
      await nextFrame();

      widget.widgetTitle = null;
      await nextFrame();

      const title = widget.querySelector('[slot="title"]');
      expect(title?.textContent).to.eql('');
    });
  });
});