import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextResize, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-dialog.js';
import { createRenderer } from './helpers.js';

describe('header/footer feature', () => {
  let dialog, overlay;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog></vaadin-dialog>');
    await nextRender();
    overlay = dialog.$.overlay;
  });

  afterEach(async () => {
    dialog.opened = false;
    await nextRender();
  });

  describe('vaadin-dialog header-title attribute', () => {
    const HEADER_TITLE = '__HEADER_TITLE__';

    it('should not have title element if header-title is not set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(dialog.querySelector('[slot="title"]')).to.not.exist;
    });

    it('should render header-title when set', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      expect(dialog.querySelector('[slot=title]')).to.exist;
      expect(dialog.textContent).to.include(HEADER_TITLE);
    });

    it('should use `h2` element for rendering header title', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      const title = dialog.querySelector('[slot=title]');
      expect(title.localName).to.equal('h2');
    });

    it('should remove title element if header-title is unset', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      dialog.headerTitle = null;
      await nextUpdate(dialog);
      expect(dialog.querySelector('[slot=title]')).to.not.exist;
    });

    it('should remove title element if header-title is set to empty string', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      dialog.headerTitle = '';
      await nextUpdate(dialog);
      expect(dialog.querySelector('[slot=title]')).to.not.exist;
    });

    it('should not have [has-title] attribute on overlay element if header-title is not set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('should add [has-title] attribute on overlay element if header-title is set', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      expect(overlay.hasAttribute('has-title')).to.be.ok;
    });

    it('should remove [has-title] attribute on overlay element if header-title is unset', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      dialog.headerTitle = null;
      await nextUpdate(dialog);

      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no header-title is set', async () => {
      dialog.opened = true;
      await nextRender();

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should be displayed if header-title is set', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;
      await nextRender();

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });

    describe('accessibility', () => {
      it('should set aria-label to dialog if header-title is set', async () => {
        expect(dialog.hasAttribute('aria-label')).to.be.false;

        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;
        await nextRender();

        expect(dialog.hasAttribute('aria-label')).to.be.true;
        expect(dialog.getAttribute('aria-label')).to.equal(HEADER_TITLE);
      });

      it('should remove aria-label if header-title is unset', async () => {
        dialog.headerTitle = HEADER_TITLE;
        dialog.opened = true;
        await nextRender();

        dialog.headerTitle = null;
        await nextUpdate(dialog);
        expect(dialog.hasAttribute('aria-label')).to.be.false;
      });

      it('should not overwrite the aria-label attribute if aria-label and header-title are set', async () => {
        const ARIA_LABEL = '__ARIA_LABEL__';
        dialog.headerTitle = HEADER_TITLE;
        dialog.ariaLabel = ARIA_LABEL;
        dialog.opened = true;
        await nextRender();

        expect(dialog.getAttribute('aria-label')).to.be.equal(ARIA_LABEL);
      });
    });
  });

  describe('vaadin-dialog headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);

    it('should not have header[slot=header-content] if headerRenderer is not set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(dialog.querySelector('header[slot=header-content]')).to.not.exist;
    });

    it('should render header content if headerRenderer is set', async () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(dialog.textContent).to.include(HEADER_CONTENT);
      expect(dialog.querySelector('div[slot=header-content]')).to.exist;
    });

    it('should remove header element if headerRenderer is removed', async () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      dialog.headerRenderer = null;
      await nextUpdate(dialog);

      expect(dialog.textContent).to.not.include(HEADER_CONTENT);
      expect(dialog.querySelector('div[slot=header-content]')).to.not.exist;
    });

    it('should render new content if another headerRenderer is set', async () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      const NEW_HEADER_CONTENT = '__NEW_HEADER_CONTENT__';
      dialog.headerRenderer = createRenderer(NEW_HEADER_CONTENT);
      await nextUpdate(dialog);

      expect(dialog.textContent).to.include(NEW_HEADER_CONTENT);
      expect(dialog.textContent).to.not.include(HEADER_CONTENT);
    });

    it('should not have [has-header] attribute if no headerRenderer is set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(overlay.hasAttribute('has-header')).to.be.not.ok;
    });

    it('should add [has-header] attribute if headerRenderer is set', async () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(overlay.hasAttribute('has-header')).to.be.ok;
    });

    it('should remove [has-header] attribute if headerRenderer is unset', async () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      dialog.headerRenderer = null;
      await nextUpdate(dialog);
      expect(overlay.hasAttribute('has-header')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no headerRenderer is set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should be displayed if headerRenderer is set', async () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });
  });

  describe('vaadin-dialog footerRenderer', () => {
    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = createRenderer(FOOTER_CONTENT);

    it('should not have footer[slot=footer] if footerRenderer is not set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(dialog.querySelector('footer[slot=footer]')).to.not.exist;
    });

    it('should render footer content if footerRenderer is set', async () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(dialog.textContent).to.include(FOOTER_CONTENT);
      expect(dialog.querySelector('div[slot=footer]')).to.exist;
    });

    it('should remove footer element if footerRenderer is removed', async () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      await nextRender();

      dialog.footerRenderer = null;
      await nextUpdate(dialog);

      expect(dialog.textContent).to.not.include(FOOTER_CONTENT);
      expect(dialog.querySelector('div[slot=footer]')).to.not.exist;
    });

    it('should render new content if another footerRenderer is set', async () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      await nextRender();

      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';
      dialog.footerRenderer = createRenderer(NEW_FOOTER_CONTENT);
      await nextUpdate(dialog);

      expect(dialog.textContent).to.include(NEW_FOOTER_CONTENT);
      expect(dialog.textContent).to.not.include(FOOTER_CONTENT);
    });

    it('should not have [has-footer] attribute if no footerRenderer is set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(overlay.hasAttribute('has-footer')).to.be.not.ok;
    });

    it('should add [has-footer] attribute if footerRenderer is set', async () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(overlay.hasAttribute('has-footer')).to.be.ok;
    });

    it('should remove [has-footer] attribute if footerRenderer is unset', async () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      await nextRender();

      dialog.footerRenderer = null;
      await nextUpdate(dialog);
      expect(overlay.hasAttribute('has-footer')).to.be.not.ok;
    });

    it('[part=footer] should have display:none if no footerRenderer is set', async () => {
      dialog.opened = true;
      await nextRender();
      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=footer]')).display).to.be.equal('none');
    });

    it('[part=footer] should be displayed if footerRenderer is set', async () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;
      await nextRender();

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

    it('header and footer renderer should work with default renderer', async () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(dialog.textContent).to.include(HEADER_CONTENT);
      expect(dialog.textContent).to.include(BODY_CONTENT);
      expect(dialog.textContent).to.include(FOOTER_CONTENT);
    });

    it('header and footer renderer should work if default renderer is changed', async () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      const NEW_BODY_CONTENT = '__NEW_BODY_CONTENT__';
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);
      await nextUpdate(dialog);

      expect(dialog.textContent).to.include(HEADER_CONTENT);

      expect(dialog.textContent).to.not.include(BODY_CONTENT);
      expect(dialog.textContent).to.include(NEW_BODY_CONTENT);

      expect(dialog.textContent).to.include(FOOTER_CONTENT);
    });

    it('header and footer renderer can be changed and default renderer is not changed', async () => {
      dialog.renderer = renderer;
      dialog.footerRenderer = footerRenderer;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      const NEW_HEADER_CONTENT = '__NEW_HEADER_CONTENT__';
      dialog.headerRenderer = createRenderer(NEW_HEADER_CONTENT);
      await nextUpdate(dialog);

      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';
      dialog.footerRenderer = createRenderer(NEW_FOOTER_CONTENT);
      await nextUpdate(dialog);

      expect(dialog.textContent).to.not.include(HEADER_CONTENT);
      expect(dialog.textContent).to.include(NEW_HEADER_CONTENT);

      expect(dialog.textContent).to.include(BODY_CONTENT);

      expect(dialog.textContent).to.not.include(FOOTER_CONTENT);
      expect(dialog.textContent).to.include(NEW_FOOTER_CONTENT);
    });
  });

  describe('header-title with default renderer', () => {
    const HEADER_TITLE = '__HEADER_TITLE__';
    const BODY_CONTENT = '__BODY_CONTENT__';
    const NEW_BODY_CONTENT = '__NEW_BODY_CONTENT__';

    it('should keep header-title if renderer is added', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.opened = true;
      await nextRender();

      expect(dialog.textContent).to.include(HEADER_TITLE);
      expect(dialog.textContent).to.include(BODY_CONTENT);
    });

    it('should keep header-title if renderer is changed', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.renderer = createRenderer(NEW_BODY_CONTENT);
      dialog.opened = true;
      await nextRender();

      expect(dialog.textContent).to.include(HEADER_TITLE);
      expect(dialog.textContent).to.not.include(BODY_CONTENT);
      expect(dialog.textContent).to.include(NEW_BODY_CONTENT);
    });

    it('should keep header-title if renderer is changed while dialog is opened', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.renderer = createRenderer(BODY_CONTENT);
      dialog.opened = true;
      await nextRender();

      dialog.renderer = createRenderer(NEW_BODY_CONTENT);
      await nextUpdate(dialog);

      expect(dialog.textContent).to.include(HEADER_TITLE);
      expect(dialog.textContent).to.not.include(BODY_CONTENT);
      expect(dialog.textContent).to.include(NEW_BODY_CONTENT);
    });
  });

  describe('header-title with headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = createRenderer(HEADER_CONTENT);
    const HEADER_TITLE = '__HEADER_TITLE__';

    it('should have both header-title and headerRenderer rendered', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      expect(dialog.textContent).to.include(HEADER_TITLE);
      expect(dialog.textContent).to.include(HEADER_CONTENT);
    });

    it('should keep [part=header] visible if header-title is removed', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerTitle = null;
      await nextUpdate(dialog);
      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');
    });

    it('should keep [part=header] visible if headerRenderer is removed', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerRenderer = null;
      await nextUpdate(dialog);
      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');
    });

    it('should make [part=header] invisible if both header-title and headerRenderer are removed', async () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;
      await nextRender();

      const headerPart = overlay.shadowRoot.querySelector('[part=header]');

      expect(getComputedStyle(headerPart).display).to.not.be.equal('none');

      dialog.headerTitle = null;
      dialog.headerRenderer = null;
      await nextUpdate(dialog);
      expect(getComputedStyle(headerPart).display).to.be.equal('none');
    });
  });

  describe('overflow attribute', () => {
    let content, headerHeight, footerHeight, contentHeight;

    beforeEach(async () => {
      dialog.headerRenderer = createRenderer('Header');
      dialog.footerRenderer = createRenderer('Footer');
      dialog.renderer = createRenderer(Array(10).join('Lorem ipsum dolor sit amet\n'));
      dialog.resizable = true;
      dialog.opened = true;
      await nextRender();
      content = overlay.$.content;
      overlay.style.maxWidth = '300px';

      headerHeight = overlay.shadowRoot.querySelector('[part=header]').offsetHeight;
      footerHeight = overlay.shadowRoot.querySelector('[part=footer]').offsetHeight;
      contentHeight = overlay.shadowRoot.querySelector('[part=content]').offsetHeight;
    });

    describe('resize', () => {
      it('should not set overflow attribute when content has no scrollbar', () => {
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow attribute when scrollbar appears on resize', async () => {
        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should remove overflow attribute when header renderer is removed', async () => {
        overlay.style.maxHeight = `${contentHeight + footerHeight}px`;
        await nextResize(overlay);
        expect(overlay.hasAttribute('overflow')).to.be.true;

        dialog.headerRenderer = null;
        await nextUpdate(dialog);
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow attribute when footer renderer is removed', async () => {
        overlay.style.maxHeight = `${contentHeight + headerHeight}px`;
        await nextResize(overlay);
        expect(overlay.hasAttribute('overflow')).to.be.true;

        dialog.footerRenderer = null;
        await nextUpdate(dialog);
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow attribute when header title property is set', async () => {
        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        await nextUpdate(dialog);

        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        expect(overlay.hasAttribute('overflow')).to.be.false;

        dialog.headerTitle = 'Title';
        await nextUpdate(dialog);
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should remove overflow attribute when header title is removed', async () => {
        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        dialog.headerTitle = 'Title';
        await nextUpdate(dialog);

        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        expect(overlay.hasAttribute('overflow')).to.be.true;

        dialog.headerTitle = null;
        await nextUpdate(dialog);
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow attribute if no header, footer or title is set', async () => {
        dialog.headerTitle = 'Title';
        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);

        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        dialog.headerTitle = null;
        await nextUpdate(dialog);
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });
    });

    describe('scroll', () => {
      beforeEach(async () => {
        dialog.renderer = createRenderer(Array(100).join('Lorem ipsum dolor sit amet\n'));
        await nextUpdate(dialog);
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

  it('should not throw when setting header renderer before adding to DOM', async () => {
    dialog.headerRenderer = createRenderer('Header');
    dialog.opened = true;
    try {
      document.body.appendChild(dialog);
      await nextRender();
    } catch (err) {
      throw new Error(err);
    }
  });

  it('should not throw when setting footer renderer before adding to DOM', async () => {
    dialog.footerRenderer = createRenderer('Footer');
    dialog.opened = true;
    try {
      document.body.appendChild(dialog);
      await nextRender();
    } catch (err) {
      throw new Error(err);
    }
  });

  it('should only call header renderer once after adding dialog to DOM', async () => {
    const spy = sinon.spy();
    dialog.headerRenderer = spy;
    dialog.opened = true;
    document.body.appendChild(dialog);
    await nextRender();
    expect(spy.calledOnce).to.be.true;
  });

  it('should only call footer renderer once after adding dialog to DOM', async () => {
    const spy = sinon.spy();
    dialog.footerRenderer = spy;
    dialog.opened = true;
    document.body.appendChild(dialog);
    await nextRender();
    expect(spy.calledOnce).to.be.true;
  });
});
