import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../vaadin-dashboard-widget.js';
import { DashboardSection } from '../vaadin-dashboard-section.js';
import { DashboardWidget } from '../vaadin-dashboard-widget.js';

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

describe('widget title level', () => {
  it('should have h2 title by default', async () => {
    const widget = fixtureSync(`<vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>`);
    await nextFrame();

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h2');
  });

  it('should have h2 title by default on the section', async () => {
    const section = fixtureSync(`<vaadin-dashboard-section section-title="foo"></vaadin-dashboard-section>`);
    await nextFrame();

    const title = section.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h2');
  });

  it('should have h3 title when rendered inside a section', async () => {
    const widget = fixtureSync(`
      <vaadin-dashboard-section>
        <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
      </vaadin-dashboard-section>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h3');
  });

  it('should have h2 title after moving out of a section', async () => {
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

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h2');
  });

  it('should have h3 title after moving into a section', async () => {
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

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h3');
  });

  it('should have h3 title after defining parent section', async () => {
    const widget = fixtureSync(`
      <my-custom-section>
        <vaadin-dashboard-widget widget-title="foo"></vaadin-dashboard-widget>
      </my-custom-section>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    class MyCustomSection extends DashboardSection {}
    customElements.define('my-custom-section', MyCustomSection);
    await nextFrame();

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h3');
  });

  it('should have h3 title after defining the widget', async () => {
    const widget = fixtureSync(`
      <vaadin-dashboard-section>
        <my-custom-widget widget-title="foo"></my-custom-widget>
      </vaadin-dashboard-section>
    `).querySelector('my-custom-widget')!;
    await nextFrame();

    class MyCustomWidget extends DashboardWidget {}
    customElements.define('my-custom-widget', MyCustomWidget);
    await nextFrame();

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h3');
  });

  it('should have h3 title after moving a wrapped widget into a section', async () => {
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

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h3');
  });

  it('should not replace an explicitly defined widget title element', async () => {
    const widget = fixtureSync(`
      <vaadin-dashboard-section>
        <vaadin-dashboard-widget>
          <h2 slot="title">foo</h2>
        </vaadin-dashboard-widget>
      </vaadin-dashboard-section>
    `).querySelector('vaadin-dashboard-widget')!;
    await nextFrame();

    const title = widget.querySelector('[slot="title"]');
    expect(title?.localName).to.equal('h2');
  });
});
