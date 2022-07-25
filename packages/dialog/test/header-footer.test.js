import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../vaadin-dialog.js';
import { createRenderer } from './helpers.js';

describe('header/footer feature', () => {
  let dialog, overlay;

  beforeEach(() => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    overlay = dialog.$.overlay;
  });

  afterEach(() => {
    dialog.opened = false;
  });

  describe('vaadin-dialog header-title attribute', () => {
    const HEADER_TITLE = '__HEADER_TITLE__';

    it('should not have title element if header-title is not set', () => {
      dialog.opened = true;

      expect(overlay.querySelector('[slot="title"]')).to.not.exist;
    });

    it('should render header-title when set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(overlay.querySelector('[slot=title]')).to.exist;
      expect(overlay.textContent).to.include(HEADER_TITLE);
    });

    it('should use `h2` element for rendering header title', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      const title = overlay.querySelector('[slot=title]');
      expect(title.localName).to.equal('h2');
    });

    it('should remove title element if header-title is unset', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = null;
      expect(overlay.querySelector('[slot=title]')).to.not.exist;
    });

    it('should remove title element if header-title is set to empty string', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = '';
      expect(overlay.querySelector('[slot=title]')).to.not.exist;
    });

    it('should not have [has-title] attribute on overlay element if header-title is not set', () => {
      dialog.opened = true;

      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('should add [has-title] attribute on overlay element if header-title is set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(overlay.hasAttribute('has-title')).to.be.ok;
    });

    it('should remove [has-title] attribute on overlay element if header-title is unset', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = null;

      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no header-title is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should be displayed if header-title is set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });

    describe('accessibility', () => {
      it('should set arial-label to overlay if header-title is set', () => {
        expect(overlay.hasAttribute('aria-label')).to.be.false;

        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;

        expect(overlay.hasAttribute('aria-label')).to.be.true;
        expect(overlay.getAttribute('aria-label')).to.equal(HEADER_TITLE);
      });

      it('should remove aria-label if header-title is unset', () => {
        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;

        dialog.headerTitle = null;
        expect(overlay.hasAttribute('aria-label')).to.be.false;
      });

      it('overlay should get the value from aria-label attribute if aria-label and header-title are set', () => {
        const ARIA_LABEL = '__ARIA_LABEL__';
        dialog.headerTitle = HEADER_TITLE;
        dialog.ariaLabel = ARIA_LABEL;
        dialog.opened = true;

        expect(overlay.getAttribute('aria-label')).to.be.equal(ARIA_LABEL);
      });
    });
  });

  describe('vaadin-dialog headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);

    it('should not have header[slot=header-content] if headerRenderer is not set', () => {
      dialog.opened = true;
      expect(overlay.querySelector('header[slot=header-content]')).to.not.exist;
    });

    it('should render header content if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_CONTENT);
      expect(overlay.querySelector('div[slot=header-content]')).to.exist;
    });

    it('should remove header element if headerRenderer is removed', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      dialog.headerRenderer = null;

      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
      expect(overlay.querySelector('div[slot=header-content]')).to.not.exist;
    });

    it('should render new content if another headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const NEW_HEADER_CONTENT = '__NEW_HEADER_CONTENT__';
      dialog.headerRenderer = createRenderer(NEW_HEADER_CONTENT);

      expect(overlay.textContent).to.include(NEW_HEADER_CONTENT);
      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
    });

    it('should not have [has-header] attribute if no headerRenderer is set', () => {
      dialog.opened = true;

      expect(overlay.hasAttribute('has-header')).to.be.not.ok;
    });

    it('should add [has-header] attribute if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.hasAttribute('has-header')).to.be.ok;
    });

    it('should remove [has-header] attribute if headerRenderer is unset', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      dialog.headerRenderer = null;
      expect(overlay.hasAttribute('has-header')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no headerRenderer is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should be displayed if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });
  });

  describe('vaadin-dialog footerRenderer', () => {
    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = createRenderer(FOOTER_CONTENT);

    it('should not have footer[slot=footer] if footerRenderer is not set', () => {
      dialog.opened = true;
      expect(overlay.querySelector('footer[slot=footer]')).to.not.exist;
    });

    it('should render footer content if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(FOOTER_CONTENT);
      expect(overlay.querySelector('div[slot=footer]')).to.exist;
    });

    it('should remove footer element if footerRenderer is removed', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      dialog.footerRenderer = null;

      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
      expect(overlay.querySelector('div[slot=footer]')).to.not.exist;
    });

    it('should render new content if another footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';

      dialog.footerRenderer = createRenderer(NEW_FOOTER_CONTENT);

      expect(overlay.textContent).to.include(NEW_FOOTER_CONTENT);
      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
    });

    it('should not have [has-footer] attribute if no footerRenderer is set', () => {
      dialog.opened = true;

      expect(overlay.hasAttribute('has-footer')).to.be.not.ok;
    });

    it('should add [has-footer] attribute if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(overlay.hasAttribute('has-footer')).to.be.ok;
    });

    it('should remove [has-footer] attribute if footerRenderer is unset', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      dialog.footerRenderer = null;
      expect(overlay.hasAttribute('has-footer')).to.be.not.ok;
    });

    it('[part=footer] should have display:none if no footerRenderer is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=footer]')).display).to.be.equal('none');
    });

    it('[part=footer] should be displayed if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=footer]')).display).to.not.be.equal('none');
    });
  });

  describe('header/footer renderer with default renderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);

    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = createRenderer(FOOTER_CONTENT);

    const BODY_CONTENT = '__BODY_CONTENT__';
    const renderer = createRenderer(BODY_CONTENT);

    it('header and footer renderer should work with default renderer', () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_CONTENT);
      expect(overlay.textContent).to.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(FOOTER_CONTENT);
    });

    it('header and footer renderer should work with default renderer is changed', () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const NEW_BODY_CONTENT = '__NEW_BODY_CONTENT__';
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);

      expect(overlay.textContent).to.include(HEADER_CONTENT);

      expect(overlay.textContent).to.not.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(NEW_BODY_CONTENT);

      expect(overlay.textContent).to.include(FOOTER_CONTENT);
    });

    it('header and footer renderer can be changed and default renderer is not changed', () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const NEW_HEADER_CONTENT = '__NEW_HEADER_CONTENT__';
      dialog.headerRenderer = createRenderer(NEW_HEADER_CONTENT);

      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';
      dialog.footerRenderer = createRenderer(NEW_FOOTER_CONTENT);

      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
      expect(overlay.textContent).to.include(NEW_HEADER_CONTENT);

      expect(overlay.textContent).to.include(BODY_CONTENT);

      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
      expect(overlay.textContent).to.include(NEW_FOOTER_CONTENT);
    });
  });

  describe('header-title with default renderer', () => {
    const HEADER_TITLE = '__HEADER_TITLE__';
    const BODY_CONTENT = '__BODY_CONTENT__';
    const NEW_BODY_CONTENT = '__NEW_BODY_CONTENT__';

    it('should keep header-title if renderer is added', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.include(BODY_CONTENT);
    });

    it('should keep header-title if renderer is changed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.not.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(NEW_BODY_CONTENT);
    });

    it('should keep header-title if renderer is changed while dialog is opened', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.opened = true;
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.not.include(BODY_CONTENT);
      expect(overlay.textContent).to.include(NEW_BODY_CONTENT);
    });
  });

  describe('header-title with headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);
    const HEADER_TITLE = '__HEADER_TITLE__';

    it('should have both header-title and headerRenderer rendered', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_TITLE);
      expect(overlay.textContent).to.include(HEADER_CONTENT);
    });

    it('should keep [part=header] visible if header-title is removed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerTitle = null;
      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');
    });

    it('should keep [part=header] visible if headerRenderer is removed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerRenderer = null;
      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');
    });

    it('should make [part=header] invisible if both header-title and headerRenderer are removed', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerTitle = null;
      dialog.headerRenderer = null;
      expect(getComputedStyle(headerPart).display).to.be.equal('none');
    });
  });

  describe('overflow attribute', () => {
    let content;

    beforeEach(() => {
      dialog.headerRenderer = createRenderer('Header');
      dialog.footerRenderer = createRenderer('Footer');
      dialog.renderer = createRenderer(Array(10).join('Lorem ipsum dolor sit amet\n'));
      dialog.resizable = true;
      dialog.opened = true;
      content = overlay.$.content;
      overlay.style.maxWidth = '300px';
    });

    describe('resize', () => {
      const nextResize = (target) => {
        return new Promise((resolve) => {
          new ResizeObserver(() => setTimeout(resolve)).observe(target);
        });
      };

      it('should not set overflow attribute when content has no scrollbar', () => {
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow attribute when scrollbar appears on resize', async () => {
        overlay.style.maxHeight = '300px';
        await nextResize(overlay);

        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should remove overflow attribute when header renderer is removed', async () => {
        overlay.style.maxHeight = '300px';
        await nextResize(overlay);

        dialog.headerRenderer = null;

        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow attribute when footer renderer is removed', async () => {
        overlay.style.maxHeight = '300px';
        await nextResize(overlay);

        dialog.footerRenderer = null;

        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow attribute when header title property is set', async () => {
        dialog.headerRenderer = null;
        dialog.footerRenderer = null;

        overlay.style.maxHeight = '200px';
        await nextResize(overlay);
        expect(overlay.hasAttribute('overflow')).to.be.false;

        dialog.headerTitle = 'Title';
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should remove overflow attribute when header title is removed', async () => {
        dialog.headerRenderer = null;
        dialog.headerTitle = 'Title';

        overlay.style.maxHeight = '300px';
        await nextResize(overlay);

        dialog.headerTitle = null;

        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow attribute if no header, footer or title is set', async () => {
        dialog.headerTitle = 'Title';
        overlay.style.maxHeight = '200px';
        await nextResize(overlay);

        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        dialog.headerTitle = null;

        expect(overlay.hasAttribute('overflow')).to.be.false;
      });
    });

    describe('scroll', () => {
      beforeEach(() => {
        dialog.renderer = createRenderer(Array(100).join('Lorem ipsum dolor sit amet\n'));
      });

      it('should set overflow to "bottom" when scrollbar appears after re-render', () => {
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should update overflow to "top bottom" on partial content scroll', () => {
        content.scrollTop += 200;
        content.dispatchEvent(new CustomEvent('scroll'));

        expect(overlay.getAttribute('overflow')).to.equal('top bottom');
      });

      it('should update overflow to "top" when content is fully scrolled', () => {
        content.scrollTop += content.scrollHeight - content.clientHeight;
        content.dispatchEvent(new CustomEvent('scroll'));

        expect(overlay.getAttribute('overflow')).to.equal('top');
      });
    });
  });
});

describe('renderer set before attach', () => {
  let dialog;

  beforeEach(() => {
    dialog = document.createElement('vaadin-dialog');
    dialog.renderer = createRenderer('Content');
  });

  afterEach(() => {
    document.body.removeChild(dialog);
  });

  it('should not throw when setting header renderer before adding to DOM', () => {
    dialog.headerRenderer = createRenderer('Header');
    dialog.opened = true;
    expect(() => {
      document.body.appendChild(dialog);
    }).to.not.throw(Error);
  });

  it('should not throw when setting footer renderer before adding to DOM', () => {
    dialog.footerRenderer = createRenderer('Footer');
    dialog.opened = true;
    expect(() => {
      document.body.appendChild(dialog);
    }).to.not.throw(Error);
  });

  it('should only call header renderer once after adding dialog to DOM', () => {
    const spy = sinon.spy();
    dialog.headerRenderer = spy;
    dialog.opened = true;
    document.body.appendChild(dialog);
    expect(spy.calledOnce).to.be.true;
  });

  it('should only call footer renderer once after adding dialog to DOM', () => {
    const spy = sinon.spy();
    dialog.footerRenderer = spy;
    dialog.opened = true;
    document.body.appendChild(dialog);
    expect(spy.calledOnce).to.be.true;
  });
});
