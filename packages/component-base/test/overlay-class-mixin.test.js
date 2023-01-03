import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { OverlayClassMixin } from '../src/overlay-class-mixin.js';
import { define } from './helpers.js';

const runTests = (baseClass) => {
  const tag = define[baseClass](
    'overlay-class-mixin',
    '<slot name="overlay">',
    (Base) =>
      class extends OverlayClassMixin(Base) {
        ready() {
          super.ready();

          this._overlayElement = this.querySelector('[slot]');
        }
      },
  );

  let element, overlay;

  describe('default', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag}>
          <div slot="overlay"></div>
        </${tag}>
      `);
      await nextRender();
      overlay = element.querySelector('div');
    });

    it('should forward class names set using property', async () => {
      element.overlayClass = 'foo bar';
      await nextFrame();

      expect(overlay.classList.contains('foo')).to.be.true;
      expect(overlay.classList.contains('bar')).to.be.true;
    });

    it('should forward class names set using attribute', async () => {
      element.setAttribute('overlay-class', 'foo bar');
      await nextFrame();

      expect(overlay.classList.contains('foo')).to.be.true;
      expect(overlay.classList.contains('bar')).to.be.true;
    });

    it('should update class names when property changes', async () => {
      element.overlayClass = 'foo bar';
      await nextFrame();

      element.overlayClass = 'foo';
      await nextFrame();

      expect(overlay.classList.contains('foo')).to.be.true;
      expect(overlay.classList.contains('bar')).to.be.false;
    });

    it('should update class names when attribute changes', async () => {
      element.setAttribute('overlay-class', 'foo bar');
      await nextFrame();

      element.setAttribute('overlay-class', 'foo');
      await nextFrame();

      expect(overlay.classList.contains('foo')).to.be.true;
      expect(overlay.classList.contains('bar')).to.be.false;
    });
  });

  describe('custom classes', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag}>
          <div slot="overlay" class="qux"></div>
        </${tag}>
      `);
      await nextRender();
      overlay = element.querySelector('div');
    });

    it('should not override custom static class using property', async () => {
      element.overlayClass = 'foo bar';
      await nextFrame();

      expect(overlay.classList.contains('foo')).to.be.true;
      expect(overlay.classList.contains('bar')).to.be.true;
      expect(overlay.classList.contains('qux')).to.be.true;
    });

    it('should not override custom static class using attribute', async () => {
      element.setAttribute('overlay-class', 'foo bar');
      await nextFrame();

      expect(overlay.classList.contains('foo')).to.be.true;
      expect(overlay.classList.contains('bar')).to.be.true;
      expect(overlay.classList.contains('qux')).to.be.true;
    });

    it('should not remove custom static class when clearing property', async () => {
      element.overlayClass = 'baz qux';
      await nextFrame();

      element.overlayClass = null;
      await nextFrame();

      expect(overlay.classList.contains('baz')).to.be.false;
      expect(overlay.classList.contains('qux')).to.be.true;
    });

    it('should not remove custom static class when removing attribute', async () => {
      element.setAttribute('overlay-class', 'baz qux');
      await nextFrame();

      element.removeAttribute('overlay-class');
      await nextFrame();

      expect(overlay.classList.contains('baz')).to.be.false;
      expect(overlay.classList.contains('qux')).to.be.true;
    });

    it('should not remove custom dynamic class when clearing property', async () => {
      overlay.classList.add('xyz');

      element.overlayClass = 'abc xyz';
      await nextFrame();

      element.overlayClass = null;
      await nextFrame();

      expect(overlay.classList.contains('abc')).to.be.false;
      expect(overlay.classList.contains('xyz')).to.be.true;
    });

    it('should not remove custom dynamic class when removing attribute', async () => {
      overlay.classList.add('xyz');

      element.setAttribute('overlay-class', 'abc xyz');
      await nextFrame();

      element.removeAttribute('overlay-class');
      await nextFrame();

      expect(overlay.classList.contains('abc')).to.be.false;
      expect(overlay.classList.contains('xyz')).to.be.true;
    });
  });
};

describe('OverlayClassMixin + Polymer', () => {
  runTests('polymer');
});

describe('OverlayClassMixin + Lit', () => {
  runTests('lit');
});
