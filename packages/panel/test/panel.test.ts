import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import type { Panel } from '../vaadin-panel.js';

function fixturePanel(content: string, attrs = ''): Panel {
  const wrapper = fixtureSync(`
    <div style="height: 300px; width: 400px; display: flex; flex-direction: column;">
      <vaadin-panel ${attrs}>${content}</vaadin-panel>
    </div>
  `);
  return wrapper.firstElementChild as Panel;
}

function getPart(panel: Panel, name: string): HTMLElement {
  return panel.shadowRoot!.querySelector(`[part="${name}"]`)!;
}

function createChild(style: string): HTMLElement {
  const child = document.createElement('div');
  child.setAttribute('style', style);
  return child;
}

function getVerticalPadding(el: HTMLElement) {
  const style = getComputedStyle(el);
  return parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
}

// Relies on the controller's requestAnimationFrame being queued before the test's `nextFrame()`.
async function nextOverflowUpdate(child: HTMLElement) {
  await nextResize(child);
  await nextFrame();
}

describe('vaadin-panel', () => {
  let panel: Panel;
  let content: HTMLElement;

  before(async () => {
    window.Vaadin ??= {};
    window.Vaadin.featureFlags ??= {};
    window.Vaadin.featureFlags.panelComponent = true;
    await import('../vaadin-panel.js');
  });

  describe('custom element definition', () => {
    beforeEach(async () => {
      panel = fixturePanel('');
      await nextRender();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-panel')).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect((customElements.get('vaadin-panel') as any).is).to.equal('vaadin-panel');
    });
  });

  describe('title', () => {
    function getHeading() {
      return panel.querySelector('[slot="title"][role="heading"]') as HTMLElement;
    }

    beforeEach(async () => {
      panel = fixturePanel('', 'header-title="Bookings"');
      await nextRender();
    });

    it('should generate a heading with default aria-level from header-title', () => {
      const headings = panel.querySelectorAll('[slot="title"][role="heading"]');
      expect(headings.length).to.equal(1);
      expect(getHeading().getAttribute('aria-level')).to.equal('2');
      expect(getHeading().textContent).to.equal('Bookings');
    });

    it('should update aria-level when heading-level changes', async () => {
      panel.setAttribute('heading-level', '3');
      await nextUpdate(panel);
      expect(getHeading().getAttribute('aria-level')).to.equal('3');
    });

    it('should label the host by the generated heading', () => {
      expect(panel.getAttribute('aria-labelledby')).to.equal(getHeading().id);
    });

    it('should remove the heading, has-title and aria-labelledby when header-title is cleared', async () => {
      panel.headerTitle = '';
      await nextUpdate(panel);
      await nextFrame();
      expect(getHeading()).to.be.null;
      expect(panel.hasAttribute('has-title')).to.be.false;
      expect(panel.hasAttribute('aria-labelledby')).to.be.false;
    });

    describe('slotted title', () => {
      let title: HTMLElement;

      beforeEach(async () => {
        title = document.createElement('div');
        title.slot = 'title';
        title.innerHTML = '<h2>Booking Details</h2><span>IRST-289163384</span>';
        panel.appendChild(title);
        await nextFrame();
      });

      it('should replace the generated heading', () => {
        expect(getHeading()).to.be.null;
        expect(panel.querySelectorAll('[slot="title"]').length).to.equal(1);
      });

      it('should generate an id and label the host by it', () => {
        expect(title.id).to.be.ok;
        expect(panel.getAttribute('aria-labelledby')).to.equal(title.id);
      });

      it('should keep the slotted title content when it is removed', async () => {
        title.remove();
        await nextFrame();
        expect(title.innerHTML).to.equal('<h2>Booking Details</h2><span>IRST-289163384</span>');
        expect(title.hasAttribute('aria-level')).to.be.false;
      });

      it('should restore the generated heading when the slotted title is removed', async () => {
        title.remove();
        await nextFrame();
        expect(getHeading().textContent).to.equal('Bookings');
        expect(panel.getAttribute('aria-labelledby')).to.equal(getHeading().id);
      });

      it('should label the host by the slotted title when it is added again', async () => {
        title.remove();
        await nextFrame();
        panel.appendChild(title);
        await nextFrame();
        expect(getHeading()).to.be.null;
        expect(panel.getAttribute('aria-labelledby')).to.equal(title.id);
      });

      it('should keep the slotted title when header-title changes', async () => {
        panel.headerTitle = 'Other';
        await nextUpdate(panel);
        await nextFrame();
        expect(title.isConnected).to.be.true;
        expect(getHeading()).to.be.null;
        expect(panel.getAttribute('aria-labelledby')).to.equal(title.id);
      });
    });

    it('should remove aria-labelledby when the slotted title is removed and header-title is not set', async () => {
      panel = fixturePanel('<div slot="title">Custom</div>');
      await nextRender();
      panel.querySelector('[slot="title"]')!.remove();
      await nextFrame();
      expect(panel.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('should keep the id of a slotted title', async () => {
      panel = fixturePanel('<div slot="title" id="custom-title">Custom</div>');
      await nextRender();
      expect(panel.getAttribute('aria-labelledby')).to.equal('custom-title');
    });
  });

  describe('role', () => {
    it('should set role="region" by default', async () => {
      panel = fixturePanel('');
      await nextRender();
      expect(panel.getAttribute('role')).to.equal('region');
    });

    ['none', 'presentation'].forEach((role) => {
      it(`should not set aria-labelledby when role is ${role}`, async () => {
        panel = fixturePanel('', `role="${role}" header-title="Title"`);
        await nextRender();
        expect(panel.hasAttribute('aria-labelledby')).to.be.false;
      });
    });

    it('should keep a role set by the developer', async () => {
      panel = fixturePanel('', 'role="none"');
      await nextRender();
      expect(panel.getAttribute('role')).to.equal('none');
    });
  });

  describe('state attributes', () => {
    beforeEach(async () => {
      panel = fixturePanel('');
      await nextRender();
    });

    ['title', 'header-prefix', 'header-suffix', 'footer'].forEach((slot) => {
      it(`should toggle has-${slot} attribute on adding and removing a ${slot} child`, async () => {
        const child = document.createElement('div');
        child.slot = slot;
        panel.appendChild(child);
        await nextFrame();
        expect(panel.hasAttribute(`has-${slot}`)).to.be.true;

        child.remove();
        await nextFrame();
        expect(panel.hasAttribute(`has-${slot}`)).to.be.false;
      });
    });
  });

  describe('empty areas', () => {
    beforeEach(async () => {
      panel = fixturePanel('<div>Content</div>');
      await nextRender();
    });

    it('should hide the header part when there is no header content', () => {
      expect(getComputedStyle(getPart(panel, 'header')).display).to.equal('none');
    });

    it('should hide the footer part when there is no footer content', () => {
      expect(getComputedStyle(getPart(panel, 'footer')).display).to.equal('none');
    });
  });

  describe('header suffix', () => {
    let header: HTMLElement;
    let first: HTMLElement;
    let last: HTMLElement;

    async function setup(attrs = '') {
      panel = fixturePanel(
        `
          <button slot="header-suffix">Cancel</button>
          <button slot="header-suffix">Save</button>
        `,
        attrs,
      );
      await nextRender();
      header = getPart(panel, 'header');
      [first, last] = panel.querySelectorAll<HTMLElement>('[slot="header-suffix"]');
    }

    it('should place the suffix at the end edge of the header', async () => {
      await setup();
      const paddingRight = parseFloat(getComputedStyle(header).paddingRight);
      expect(last.getBoundingClientRect().right).to.be.closeTo(
        header.getBoundingClientRect().right - paddingRight,
        0.5,
      );
    });

    it('should separate the suffix children with the suffix gap', async () => {
      await setup();
      const gap = parseFloat(getComputedStyle(panel.shadowRoot!.querySelector('#suffix')!).columnGap);
      const space = last.getBoundingClientRect().left - first.getBoundingClientRect().right;
      expect(space).to.be.closeTo(gap, 0.5);
    });

    it('should place the suffix at the left edge in RTL', async () => {
      await setup('dir="rtl"');
      const paddingLeft = parseFloat(getComputedStyle(header).paddingLeft);
      expect(last.getBoundingClientRect().left).to.be.closeTo(header.getBoundingClientRect().left + paddingLeft, 0.5);
    });
  });

  describe('content', () => {
    it('should let a height: 100% child fill the content part', async () => {
      panel = fixturePanel('<div style="height: 100%"></div>', 'header-title="Title"');
      await nextRender();
      content = getPart(panel, 'content');
      const child = panel.querySelector('div:not([slot])') as HTMLElement;
      await nextResize(panel);
      await nextFrame();
      expect(child.offsetHeight).to.equal(content.clientHeight - getVerticalPadding(content));
      expect(content.hasAttribute('tabindex')).to.be.false;
    });

    it('should scroll tall content inside the content part', async () => {
      panel = fixturePanel(
        `
          <div style="height: 1000px"></div>
          <button slot="footer">Footer</button>
        `,
        'header-title="Title"',
      );
      await nextRender();
      content = getPart(panel, 'content');
      const header = getPart(panel, 'header');
      const footer = getPart(panel, 'footer');
      const headerTop = header.getBoundingClientRect().top;
      const footerTop = footer.getBoundingClientRect().top;

      content.scrollTop = 200;

      expect(content.scrollTop).to.equal(200);
      expect(header.getBoundingClientRect().top).to.equal(headerTop);
      expect(footer.getBoundingClientRect().top).to.equal(footerTop);
    });
  });

  describe('content tab stop', () => {
    it('should set tabindex 0 on the content part when the initial content overflows', async () => {
      panel = fixturePanel('<div style="height: 1000px"></div>');
      await nextRender();
      await nextOverflowUpdate(panel.firstElementChild as HTMLElement);
      expect(getPart(panel, 'content').getAttribute('tabindex')).to.equal('0');
    });

    it('should not set tabindex on the content part when the initial content is short', async () => {
      panel = fixturePanel('<div style="height: 50px"></div>');
      await nextRender();
      await nextOverflowUpdate(panel.firstElementChild as HTMLElement);
      expect(getPart(panel, 'content').hasAttribute('tabindex')).to.be.false;
    });
  });

  describe('overflow tracking', () => {
    let short: HTMLElement;

    beforeEach(async () => {
      panel = fixturePanel('<div style="height: 50px"></div>');
      await nextRender();
      content = getPart(panel, 'content');
      short = panel.firstElementChild as HTMLElement;
      await nextOverflowUpdate(short);
    });

    it('should set overflow and tabindex when a tall child is appended', async () => {
      const tall = createChild('height: 1000px');
      panel.appendChild(tall);
      await nextOverflowUpdate(tall);
      expect(panel.hasAttribute('overflow')).to.be.true;
      expect(content.getAttribute('tabindex')).to.equal('0');
    });

    it('should remove overflow and tabindex when the tall child is removed', async () => {
      const tall = createChild('height: 1000px');
      panel.appendChild(tall);
      await nextOverflowUpdate(tall);

      tall.remove();
      await nextFrame();
      expect(panel.hasAttribute('overflow')).to.be.false;
      expect(content.hasAttribute('tabindex')).to.be.false;
    });

    it('should set tabindex when all children are replaced by a tall child', async () => {
      const tall = createChild('height: 1000px');
      panel.replaceChildren();
      panel.appendChild(tall);
      await nextOverflowUpdate(tall);
      expect(content.getAttribute('tabindex')).to.equal('0');
    });

    it('should set tabindex when an existing child grows', async () => {
      short.style.height = '1000px';
      await nextOverflowUpdate(short);
      expect(content.getAttribute('tabindex')).to.equal('0');
    });

    it('should set overflow end and tabindex when a wide child is appended', async () => {
      const wide = createChild('width: 2000px; height: 10px');
      panel.appendChild(wide);
      await nextOverflowUpdate(wide);
      expect(panel.getAttribute('overflow')).to.contain('end');
      expect(content.getAttribute('tabindex')).to.equal('0');
    });

    it('should set tabindex when a tall child is appended after the panel is moved', async () => {
      const target = fixtureSync('<div style="height: 300px"></div>');
      target.appendChild(panel);
      await nextFrame();

      const tall = createChild('height: 1000px');
      panel.appendChild(tall);
      await nextOverflowUpdate(tall);
      expect(content.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe('click on content', () => {
    beforeEach(async () => {
      panel = fixturePanel('<div style="height: 50px; width: 50px"></div>');
      await nextRender();
      content = getPart(panel, 'content');
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('should not focus the content part on click on empty content space', async () => {
      const rect = content.getBoundingClientRect();
      await sendMouse({ type: 'click', position: [Math.round(rect.right - 20), Math.round(rect.top + 20)] });
      expect(panel.shadowRoot!.activeElement).to.be.null;
    });
  });

  describe('focus ring space', () => {
    let header: HTMLElement;
    let footer: HTMLElement;
    let child: HTMLElement;

    beforeEach(async () => {
      panel = fixturePanel(
        `
          <div style="height: 100%"></div>
          <button slot="footer">Footer</button>
        `,
        'header-title="Title"',
      );
      await nextRender();
      content = getPart(panel, 'content');
      header = getPart(panel, 'header');
      footer = getPart(panel, 'footer');
      child = panel.querySelector('div:not([slot])') as HTMLElement;
    });

    it('should align the content padding box edges with the header and footer', () => {
      const style = getComputedStyle(content);
      const rect = content.getBoundingClientRect();
      expect(rect.top + parseFloat(style.paddingTop)).to.be.closeTo(header.getBoundingClientRect().bottom, 0.5);
      expect(rect.bottom - parseFloat(style.paddingBottom)).to.be.closeTo(footer.getBoundingClientRect().top, 0.5);
    });

    it('should let a height: 100% child fill the space between header and footer', () => {
      const rect = child.getBoundingClientRect();
      expect(rect.top).to.be.closeTo(header.getBoundingClientRect().bottom, 0.5);
      expect(rect.bottom).to.be.closeTo(footer.getBoundingClientRect().top, 0.5);
    });
  });

  describe('overflow indicators', () => {
    function getIndicatorOpacity(part: string) {
      return getComputedStyle(getPart(panel, part), '::after').opacity;
    }

    async function scrollToMiddle() {
      content = getPart(panel, 'content');
      const scroll = new Promise((resolve) => {
        content.addEventListener('scroll', resolve, { once: true });
      });
      content.scrollTop = 400;
      await scroll;
    }

    it('should show the header and footer indicators when content scrolls', async () => {
      panel = fixturePanel(
        `
          <div style="height: 1000px"></div>
          <button slot="footer">Footer</button>
        `,
        'header-title="Title"',
      );
      await nextRender();
      await scrollToMiddle();
      expect(getIndicatorOpacity('header')).to.equal('1');
      expect(getIndicatorOpacity('footer')).to.equal('1');
    });

    it('should hide the footer part when content scrolls without a footer', async () => {
      panel = fixturePanel('<div style="height: 1000px"></div>', 'header-title="Title"');
      await nextRender();
      await scrollToMiddle();
      expect(panel.getAttribute('overflow')).to.contain('bottom');
      expect(getComputedStyle(getPart(panel, 'footer')).display).to.equal('none');
    });
  });
});
