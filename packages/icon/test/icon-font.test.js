import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-icon.js';
import { iconFontCss } from './test-icon-font.js';

describe('vaadin-icon - icon fonts', () => {
  beforeEach(() => {
    fixtureSync(`
      <style>
        ${iconFontCss}
      </style>
    `);
  });

  describe('sizing', () => {
    let icon;

    beforeEach(async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextResize(icon);
    });

    it('should have the same height as the host', () => {
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(24, 1);
    });

    it('should resize with the host', async () => {
      icon.style.width = '100px';
      icon.style.height = '100px';
      await nextResize(icon);
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(100, 1);
    });

    it('should not overflow host - wider icon', async () => {
      icon.style.width = '150px';
      icon.style.height = '100px';
      await nextResize(icon);
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(100, 1);
    });

    it('should not overflow host - line height', () => {
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(parseInt(fontIconStyle.height)).to.be.closeTo(24, 1);
    });

    it('should subtract vertical padding from height', async () => {
      // Workaround to trigger cqh recalculation in Safari and Firefox
      // https://github.com/vaadin/web-components/issues/8397
      async function iconRender(icon) {
        icon.style.display = 'block';
        await nextResize(icon);
        icon.style.display = '';
      }

      icon.style.padding = '5px';
      await nextResize(icon);
      await iconRender(icon);
      expect(parseInt(getComputedStyle(icon, ':before').height)).to.be.closeTo(14, 1);

      icon.style.padding = '7px';
      await nextResize(icon);
      await iconRender(icon);
      expect(parseInt(getComputedStyle(icon, ':before').height)).to.be.closeTo(10, 1);
    });
  });

  describe('iconClass', () => {
    let icon;

    it('should add the icon class to element class list', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextFrame();
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
    });

    it('should not overwrite existing classes', async () => {
      icon = fixtureSync('<vaadin-icon class="foo"></vaadin-icon>');
      await nextFrame();
      icon.iconClass = 'my-icon-font icon-before';
      expect(icon.classList.contains('foo')).to.be.true;
    });

    it('should change icon classes', async () => {
      icon = fixtureSync('<vaadin-icon class="foo" icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextFrame();
      icon.iconClass = 'my-icon-font icon-after';
      expect(icon.classList.contains('icon-before')).to.be.false;
      expect(icon.classList.contains('icon-after')).to.be.true;
    });

    it('should remove all icon classes', async () => {
      icon = fixtureSync('<vaadin-icon class="foo" icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextFrame();
      icon.iconClass = '';
      expect(icon.classList.contains('my-icon-font')).to.be.false;
      expect(icon.classList.contains('icon-before')).to.be.false;
      expect(icon.classList.contains('foo')).to.be.true;
    });

    it('should restore the icon class to element class list', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextFrame();
      icon.className = 'foo';
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
      expect(icon.classList.contains('foo')).to.be.true;
    });

    it('should restore the missing icon class to element class list', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextFrame();
      icon.className = 'my-icon-font';
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
    });

    it('should restore the removed icon class to element class list', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font icon-before"></vaadin-icon>');
      await nextFrame();
      icon.classList.remove('my-icon-font');
      expect(icon.classList.contains('my-icon-font')).to.be.true;
      expect(icon.classList.contains('icon-before')).to.be.true;
    });

    it('should reflect icon class as an attribute', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.iconClass = 'my-icon-font icon-before';
      expect(icon.getAttribute('icon-class')).to.equal('my-icon-font icon-before');
    });

    it('should add icon attribute if icon class is set', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.iconClass = 'my-icon-font icon-before';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if icon class is not set', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.iconClass = null;
      expect(icon.hasAttribute('icon')).to.be.false;
    });

    it('should not override existing icon', async () => {
      icon = fixtureSync('<vaadin-icon icon="foo:bar"></vaadin-icon>');
      await nextFrame();
      icon.iconClass = 'my-icon-font icon-before';
      expect(icon.icon).to.equal('foo:bar');
    });
  });

  describe('char', () => {
    let icon;

    it('should reflect unprefixed char as font-icon-content attribute', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font"></vaadin-icon>');
      await nextFrame();
      icon.char = 'e900';
      expect(icon.getAttribute('font-icon-content')).to.equal('\ue900');
    });

    it('should reflect prefixed char as font-icon-content attribute', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font"></vaadin-icon>');
      await nextFrame();
      icon.char = '\ue900';
      expect(icon.getAttribute('font-icon-content')).to.equal('\ue900');
    });

    it('should remove font-icon-content attribute', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font"></vaadin-icon>');
      await nextFrame();
      icon.char = 'e900';
      icon.char = null;
      expect(icon.hasAttribute('font-icon-content')).to.be.false;
    });

    it('should add icon attribute if char is set', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.char = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if char is not set', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.char = null;
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.false;
    });

    it('should not override existing icon', async () => {
      icon = fixtureSync('<vaadin-icon icon="foo:bar"></vaadin-icon>');
      await nextFrame();
      icon.char = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.icon).to.equal('foo:bar');
    });
  });

  describe('ligature', () => {
    let icon;

    it('should reflect ligature as font-icon-content attribute', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font"></vaadin-icon>');
      await nextFrame();
      icon.ligature = 'foo';
      expect(icon.getAttribute('font-icon-content')).to.equal('foo');
    });

    it('should remove font-icon-content attribute', async () => {
      icon = fixtureSync('<vaadin-icon icon-class="my-icon-font"></vaadin-icon>');
      await nextFrame();
      icon.ligature = 'foo';
      icon.ligature = null;
      expect(icon.hasAttribute('font-icon-content')).to.be.false;
    });

    it('should add icon attribute if ligature is set', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.ligature = '\ue900';
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.true;
    });

    it('should not add icon attribute if ligature is not set', async () => {
      icon = fixtureSync('<vaadin-icon></vaadin-icon>');
      await nextFrame();
      icon.ligature = null;
      icon.style.fontFamily = 'My icons';
      expect(icon.hasAttribute('icon')).to.be.false;
    });

    it('should not override existing icon', async () => {
      icon = fixtureSync('<vaadin-icon icon="foo:bar"></vaadin-icon>');
      await nextFrame();
      icon.ligature = 'foo';
      icon.style.fontFamily = 'My icons';
      expect(icon.icon).to.equal('foo:bar');
    });
  });

  describe('fontFamily', () => {
    let icon;

    it('should set font-family for the icon element', async () => {
      icon = fixtureSync('<vaadin-icon char="e900"></vaadin-icon>');
      await nextFrame();
      icon.fontFamily = 'My icons';
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(['"My icons"', 'My icons']).to.include(fontIconStyle.fontFamily);
    });

    it('should set font-family with numbers for the icon element', async () => {
      icon = fixtureSync('<vaadin-icon char="e900"></vaadin-icon>');
      await nextFrame();
      icon.fontFamily = 'My icons 6';
      const fontIconStyle = getComputedStyle(icon, ':before');
      expect(['"My icons 6"', 'My icons 6']).to.include(fontIconStyle.fontFamily);
    });
  });
});
