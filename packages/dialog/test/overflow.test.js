import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender, nextResize, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-dialog.js';
import { createRenderer } from './helpers.js';

describe('overflow', () => {
  let dialog, overlay;

  beforeEach(async () => {
    dialog = fixtureSync('<vaadin-dialog theme="no-padding"></vaadin-dialog>');
    fixtureSync(`
      <style>
        vaadin-dialog::part(overlay) {
          border: none;
        }
      </style>
    `);
    await nextRender();
    overlay = dialog.$.overlay;
  });

  describe('slotted content', () => {
    let content;

    beforeEach(async () => {
      dialog.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      content = document.createElement('div');
      content.style.maxWidth = '300px';
      content.textContent = Array(100).join('Lorem ipsum dolor sit amet');
    });

    it('should set overflow attribute when adding content that overflows', async () => {
      dialog.appendChild(content);
      await nextRender();
      expect(dialog.hasAttribute('overflow')).to.be.true;
    });

    it('should remove overflow attribute when overflowing content changes', async () => {
      dialog.appendChild(content);
      await nextRender();

      content.textContent = 'Single line content';
      await nextResize(content);
      await nextRender();

      expect(dialog.hasAttribute('overflow')).to.be.false;
    });

    it('should update overflow attribute when dialog height changes after resizing content', async () => {
      content.textContent = Array(50).join('Large content!');
      content.style.minHeight = '400px';
      dialog.appendChild(content);
      await nextRender();

      expect(dialog.hasAttribute('overflow')).to.be.false;

      dialog.height = '200px';
      await nextResize(content);
      await nextRender();

      expect(dialog.hasAttribute('overflow')).to.be.true;
    });

    it('should update overflow attribute when content is resized after changing height', async () => {
      content.textContent = 'Single line content';
      dialog.appendChild(content);
      await nextRender();

      dialog.height = '200px';
      await nextRender();

      expect(dialog.hasAttribute('overflow')).to.be.false;

      content.style.minHeight = '400px';
      await nextResize(content);
      await nextRender();

      expect(dialog.hasAttribute('overflow')).to.be.true;
    });
  });

  describe('renderers', () => {
    let content, headerHeight, footerHeight, contentHeight;

    beforeEach(async () => {
      dialog.headerRenderer = createRenderer('Header');
      dialog.footerRenderer = createRenderer('Footer');
      dialog.renderer = createRenderer(Array(10).join('Lorem ipsum dolor sit amet\n'));
      dialog.resizable = true;
      dialog.opened = true;
      await oneEvent(overlay, 'vaadin-overlay-open');
      content = overlay.$.content;
      overlay.style.maxWidth = '300px';

      headerHeight = overlay.shadowRoot.querySelector('[part=header]').offsetHeight;
      footerHeight = overlay.shadowRoot.querySelector('[part=footer]').offsetHeight;
      contentHeight = overlay.shadowRoot.querySelector('[part=content]').offsetHeight;
    });

    describe('resize', () => {
      it('should not set overflow attribute when content has no scrollbar', () => {
        expect(dialog.hasAttribute('overflow')).to.be.false;
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow attribute when scrollbar appears on resize', async () => {
        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        await nextFrame();
        expect(dialog.getAttribute('overflow')).to.equal('bottom');
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should remove overflow attribute when header renderer is removed', async () => {
        overlay.style.maxHeight = `${contentHeight + footerHeight}px`;
        await nextResize(overlay);
        await nextFrame();
        expect(dialog.hasAttribute('overflow')).to.be.true;
        expect(overlay.hasAttribute('overflow')).to.be.true;

        dialog.headerRenderer = null;
        await nextUpdate(dialog);
        expect(dialog.hasAttribute('overflow')).to.be.false;
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow attribute when footer renderer is removed', async () => {
        overlay.style.maxHeight = `${contentHeight + headerHeight}px`;
        await nextResize(overlay);
        await nextFrame();
        expect(dialog.hasAttribute('overflow')).to.be.true;
        expect(overlay.hasAttribute('overflow')).to.be.true;

        dialog.footerRenderer = null;
        await nextUpdate(dialog);
        expect(dialog.hasAttribute('overflow')).to.be.false;
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should set overflow attribute when header title property is set', async () => {
        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        await nextUpdate(dialog);

        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        await nextFrame();
        expect(dialog.hasAttribute('overflow')).to.be.false;
        expect(overlay.hasAttribute('overflow')).to.be.false;

        dialog.headerTitle = 'Title';
        await nextUpdate(dialog);
        expect(dialog.getAttribute('overflow')).to.equal('bottom');
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should remove overflow attribute when header title is removed', async () => {
        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        dialog.headerTitle = 'Title';
        await nextUpdate(dialog);

        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        await nextFrame();
        expect(dialog.hasAttribute('overflow')).to.be.true;
        expect(overlay.hasAttribute('overflow')).to.be.true;

        dialog.headerTitle = null;
        await nextUpdate(dialog);
        expect(dialog.hasAttribute('overflow')).to.be.false;
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });

      it('should remove overflow attribute if no header, footer or title is set', async () => {
        dialog.headerTitle = 'Title';
        overlay.style.maxHeight = `${contentHeight}px`;
        await nextResize(overlay);
        await nextFrame();

        dialog.headerRenderer = null;
        dialog.footerRenderer = null;
        dialog.headerTitle = null;
        await nextUpdate(dialog);
        expect(dialog.hasAttribute('overflow')).to.be.false;
        expect(overlay.hasAttribute('overflow')).to.be.false;
      });
    });

    describe('scroll', () => {
      beforeEach(async () => {
        dialog.renderer = createRenderer(Array(100).join('Lorem ipsum dolor sit amet\n'));
        await nextUpdate(dialog);
      });

      it('should set overflow to "bottom" when scrollbar appears after re-render', () => {
        expect(dialog.getAttribute('overflow')).to.equal('bottom');
        expect(overlay.getAttribute('overflow')).to.equal('bottom');
      });

      it('should update overflow to "top bottom" on partial content scroll', () => {
        content.scrollTop += 200;
        content.dispatchEvent(new CustomEvent('scroll'));

        expect(dialog.getAttribute('overflow')).to.equal('top bottom');
        expect(overlay.getAttribute('overflow')).to.equal('top bottom');
      });

      it('should update overflow to "top" when content is fully scrolled', () => {
        content.scrollTop += content.scrollHeight - content.clientHeight;
        content.dispatchEvent(new CustomEvent('scroll'));

        expect(dialog.getAttribute('overflow')).to.equal('top');
        expect(overlay.getAttribute('overflow')).to.equal('top');
      });
    });
  });
});
