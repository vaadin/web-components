import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-dialog.js';

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

      expect(overlay.querySelector('#title')).to.not.exist;
    });

    it('should render header-title when set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(overlay.querySelector('#title')).to.exist;
      expect(overlay.textContent).to.include(HEADER_TITLE);
    });

    it('should remove title element if header-title is unset', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = null;
      expect(overlay.querySelector('#title')).to.not.exist;
    });

    it('should remove title element if header-title is set to empty string', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = '';
      expect(overlay.querySelector('#title')).to.not.exist;
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

    it('should remove [has-title] attribute on overlay element if header-title is set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      dialog.headerTitle = null;

      expect(overlay.hasAttribute('has-title')).to.be.not.ok;
    });

    it('[part=header] should have display:none if no header-title is set', () => {
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.be.equal('none');
    });

    it('[part=header] should have be displayed if no header-title is set', () => {
      dialog.headerTitle = HEADER_TITLE;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });
  });

  describe('vaadin-dialog headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = (root) => {
      if (root.firstChild) {
        return;
      }

      const span = document.createElement('span');
      span.textContent = HEADER_CONTENT;
      root.appendChild(span);
    };

    it('should not have header[slot=header-content] if headerRenderer is not set', () => {
      dialog.opened = true;
      expect(overlay.querySelector('header[slot=header-content]')).to.not.exist;
    });

    it('should render header content if headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(HEADER_CONTENT);
      expect(overlay.querySelector('header[slot=header-content]')).to.exist;
    });

    it('should remove header element if headerRenderer is removed', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      dialog.headerRenderer = null;

      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
      expect(overlay.querySelector('header[slot=header-content]')).to.not.exist;
    });

    it('should render new content if another headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      dialog.headerRenderer = (root) => {
        if (root.firstChild) {
          return;
        }

        const span = document.createElement('span');
        span.textContent = '__LOREM_IPSUM__';
        root.appendChild(span);
      };

      expect(overlay.textContent).to.include('__LOREM_IPSUM__');
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

    it('[part=header] should have be displayed if no headerRenderer is set', () => {
      dialog.headerRenderer = headerRenderer;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=header]')).display).to.not.be.equal('none');
    });
  });

  describe('vaadin-dialog footerRenderer', () => {
    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = (root) => {
      if (root.firstChild) {
        return;
      }

      const span = document.createElement('span');
      span.textContent = FOOTER_CONTENT;
      root.appendChild(span);
    };

    it('should not have footer[slot=footer] if footerRenderer is not set', () => {
      dialog.opened = true;
      expect(overlay.querySelector('footer[slot=footer]')).to.not.exist;
    });

    it('should render footer content if footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(overlay.textContent).to.include(FOOTER_CONTENT);
      expect(overlay.querySelector('footer[slot=footer]')).to.exist;
    });

    it('should remove footer element if footerRenderer is removed', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      dialog.footerRenderer = null;

      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
      expect(overlay.querySelector('footer[slot=footer]')).to.not.exist;
    });

    it('should render new content if another footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      dialog.footerRenderer = (root) => {
        if (root.firstChild) {
          return;
        }

        const span = document.createElement('span');
        span.textContent = 'LOREM_IPSUM';
        root.appendChild(span);
      };

      expect(overlay.textContent).to.include('LOREM_IPSUM');
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

    it('[part=footer] should have be displayed if no footerRenderer is set', () => {
      dialog.footerRenderer = footerRenderer;
      dialog.opened = true;

      expect(getComputedStyle(overlay.shadowRoot.querySelector('[part=footer]')).display).to.not.be.equal('none');
    });
  });

  describe('header/footer renderer with default renderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = (root) => {
      if (root.firstChild) {
        return;
      }

      const span = document.createElement('span');
      span.textContent = HEADER_CONTENT;
      root.appendChild(span);
    };

    const FOOTER_CONTENT = '__FOOTER_CONTENT__';
    const footerRenderer = (root) => {
      if (root.firstChild) {
        return;
      }

      const span = document.createElement('span');
      span.textContent = FOOTER_CONTENT;
      root.appendChild(span);
    };

    const BODY_CONTENT = '__BODY_CONTENT__';
    const renderer = (root) => {
      if (root.firstChild) {
        return;
      }

      const span = document.createElement('span');
      span.textContent = BODY_CONTENT;
      root.appendChild(span);
    };

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
      dialog.renderer = (root) => {
        if (root.firstChild) {
          return;
        }
        const span = document.createElement('span');
        span.textContent = NEW_BODY_CONTENT;
        root.appendChild(span);
      };

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
      dialog.headerRenderer = (root) => {
        if (root.firstChild) {
          return;
        }
        const span = document.createElement('span');
        span.textContent = NEW_HEADER_CONTENT;
        root.appendChild(span);
      };

      const NEW_FOOTER_CONTENT = '__NEW_FOOTER_CONTENT__';
      dialog.footerRenderer = (root) => {
        if (root.firstChild) {
          return;
        }
        const span = document.createElement('span');
        span.textContent = NEW_FOOTER_CONTENT;
        root.appendChild(span);
      };

      expect(overlay.textContent).to.not.include(HEADER_CONTENT);
      expect(overlay.textContent).to.include(NEW_HEADER_CONTENT);

      expect(overlay.textContent).to.include(BODY_CONTENT);

      expect(overlay.textContent).to.not.include(FOOTER_CONTENT);
      expect(overlay.textContent).to.include(NEW_FOOTER_CONTENT);
    });
  });

  describe('header-title with headerRenderer', () => {
    const HEADER_CONTENT = '__HEADER_CONTENT__';
    const headerRenderer = (root) => {
      if (root.firstChild) {
        return;
      }

      const span = document.createElement('span');
      span.textContent = HEADER_CONTENT;
      root.appendChild(span);
    };
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
});
