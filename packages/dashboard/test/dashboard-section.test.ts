import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-section.js';
import type { DashboardSection } from '../vaadin-dashboard-section.js';

describe('dashboard section', () => {
  let section: DashboardSection;

  beforeEach(async () => {
    section = fixtureSync(`
      <vaadin-dashboard-section>
        <div id="item-0">Item 0</div>
        <div id="item-1">Item 1</div>
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

    it('should add title id to aria-labelledby attribute when using property', async () => {
      section.sectionTitle = 'Custom title';
      await nextFrame();
      const title = section.querySelector('[slot="title"]');
      expect(section.getAttribute('aria-labelledby')).equal(title?.id);
    });

    it('should add title id to aria-labelledby attribute when using slot', async () => {
      const title = document.createElement('div');
      title.id = 'custom-title';
      title.slot = 'title';
      title.textContent = 'Custom title';
      section.appendChild(title);

      await nextFrame();
      expect(section.getAttribute('aria-labelledby')).equal(title?.id);
    });

    it('should have text content for the title', async () => {
      section.sectionTitle = 'Custom title';
      await nextFrame();
      const title = section.querySelector('[slot="title"]');
      expect(title?.textContent).equal('Custom title');
    });
  });

  describe('title', () => {
    it('should not override custom title element', async () => {
      const title = document.createElement('div');
      title.id = 'custom-title';
      title.slot = 'title';
      title.textContent = 'Custom title';
      section.appendChild(title);
      await nextFrame();

      section.sectionTitle = 'New title';
      await nextFrame();

      const titles = section.querySelectorAll('[slot="title"]');
      expect(titles.length).to.eql(1);
      expect(titles[0]).to.eql(title);
      expect(titles[0].textContent).to.eql('Custom title');
    });

    it('should not throw when initialized with a custom title', async () => {
      expect(() => {
        fixtureSync(`
          <vaadin-dashboard-section>
            <div slot="title">Custom title</div>
          </vaadin-dashboard-section>
        `);
      }).not.to.throw(Error);
      await nextFrame();
    });

    it('should empty title element when cleared', async () => {
      section.sectionTitle = 'New title';
      await nextFrame();

      section.sectionTitle = null;
      await nextFrame();

      const title = section.querySelector('[slot="title"]');
      expect(title?.textContent).to.eql('');
    });
  });
});