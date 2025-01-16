import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize } from '@vaadin/testing-helpers';
import { getComputedCSSPropertyValue } from './helpers.js';

describe('vaadin-horizontal-layout', () => {
  describe('basic features', () => {
    let layout, tagName;

    beforeEach(() => {
      layout = fixtureSync('<vaadin-horizontal-layout></vaadin-horizontal-layout>');
      tagName = layout.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });

    it('should have a box-sizing set to border-box', () => {
      expect(getComputedStyle(layout).boxSizing).to.equal('border-box');
    });
  });

  describe('theme variations', () => {
    let layout, c1, c2, space;

    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-horizontal-layout style="width: 300px; height: 200px;">
          <div id="c1">c1</div>
          <div id="c2">c2</div>
        </vaadin-horizontal-layout>
      `);
      await nextFrame();
      c1 = layout.querySelector('#c1');
      c2 = layout.querySelector('#c2');
      space = getComputedCSSPropertyValue(layout, '--lumo-space-m');
    });

    it('should place items next to each other', () => {
      expect(layout.getBoundingClientRect()).to.include({ top: 0, right: 300, bottom: 200, left: 0 });

      const c1Rect = c1.getBoundingClientRect();
      expect(c1Rect).to.include({ top: 0, bottom: 200, left: 0 });
      expect(c1Rect.right).to.be.closeTo(18, 3);

      const c2Rect = c2.getBoundingClientRect();
      expect(c2Rect).to.include({ top: 0, bottom: 200 });
      expect(c2Rect.left).to.be.closeTo(18, 3);
      expect(c2Rect.right).to.be.closeTo(36, 6);
    });

    it('should not have margin or padding by default', () => {
      const style = getComputedStyle(layout);
      expect(style.getPropertyValue('margin-top')).to.equal('0px');
      expect(style.getPropertyValue('margin-right')).to.equal('0px');
      expect(style.getPropertyValue('margin-bottom')).to.equal('0px');
      expect(style.getPropertyValue('margin-left')).to.equal('0px');
      expect(style.getPropertyValue('padding-top')).to.equal('0px');
      expect(style.getPropertyValue('padding-right')).to.equal('0px');
      expect(style.getPropertyValue('padding-bottom')).to.equal('0px');
      expect(style.getPropertyValue('padding-left')).to.equal('0px');
    });

    it('should support theme="margin"', () => {
      layout.setAttribute('theme', 'margin');
      const style = getComputedStyle(layout);
      expect(style.getPropertyValue('margin-top')).to.equal(space);
      expect(style.getPropertyValue('margin-right')).to.equal(space);
      expect(style.getPropertyValue('margin-bottom')).to.equal(space);
      expect(style.getPropertyValue('margin-left')).to.equal(space);
    });

    it('should support theme="padding"', () => {
      layout.setAttribute('theme', 'padding');
      const style = getComputedStyle(layout);
      expect(style.getPropertyValue('padding-top')).to.equal(space);
      expect(style.getPropertyValue('padding-right')).to.equal(space);
      expect(style.getPropertyValue('padding-bottom')).to.equal(space);
      expect(style.getPropertyValue('padding-left')).to.equal(space);
    });

    it('should support theme="spacing"', () => {
      layout.setAttribute('theme', 'spacing');
      expect(getComputedStyle(layout).columnGap).to.equal(space);
    });
  });

  describe('outer spacing', () => {
    let wrapper, layout;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-horizontal-layout>
            <div>Content</div>
          </vaadin-horizontal-layout>
        </div>
      `);
      layout = wrapper.firstElementChild;
    });

    it('should not occupy space outside when applying theme="spacing"', () => {
      layout.setAttribute('theme', 'spacing');
      wrapper.style.width = '200px';
      layout.style.minWidth = '200px';
      expect(wrapper.scrollWidth).to.equal(200);
    });
  });

  describe('slots', () => {
    let layout;

    beforeEach(() => {
      layout = fixtureSync('<vaadin-horizontal-layout></vaadin-horizontal-layout>');
    });

    describe('start', () => {
      it('should set has-start attribute when element added to default slot', async () => {
        const div = document.createElement('div');
        layout.appendChild(div);
        await nextFrame();
        expect(layout.hasAttribute('has-start')).to.be.true;
      });

      it('should remove has-start attribute when element removed from default slot', async () => {
        const div = document.createElement('div');
        layout.appendChild(div);
        await nextFrame();

        layout.removeChild(div);
        await nextFrame();
        expect(layout.hasAttribute('has-start')).to.be.false;
      });

      it('should set last-start-child attribute on last element in the default slot', async () => {
        const div = document.createElement('div');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('last-start-child')).to.be.true;

        const other = document.createElement('div');
        layout.appendChild(other);
        await nextFrame();
        expect(div.hasAttribute('last-start-child')).to.be.false;
        expect(other.hasAttribute('last-start-child')).to.be.true;
      });

      it('should remove last-start-child attribute when element is removed', async () => {
        const div = document.createElement('div');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('last-start-child')).to.be.true;

        layout.removeChild(div);
        await nextFrame();
        expect(div.hasAttribute('last-start-child')).to.be.false;
      });
    });

    describe('middle', () => {
      it('should set has-middle attribute when element added to middle slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'middle');
        layout.appendChild(div);
        await nextFrame();
        expect(layout.hasAttribute('has-middle')).to.be.true;
      });

      it('should remove has-middle attribute when element removed from middle slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'middle');
        layout.appendChild(div);
        await nextFrame();

        layout.removeChild(div);
        await nextFrame();
        expect(layout.hasAttribute('has-middle')).to.be.false;
      });

      it('should set first-middle-child attribute on first element in the middle slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'middle');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('first-middle-child')).to.be.true;

        const other = document.createElement('div');
        other.setAttribute('slot', 'middle');
        layout.insertBefore(other, div);
        await nextFrame();
        expect(div.hasAttribute('first-middle-child')).to.be.false;
        expect(other.hasAttribute('first-middle-child')).to.be.true;
      });

      it('should set last-middle-child attribute on last element in the middle slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'middle');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('last-middle-child')).to.be.true;

        const other = document.createElement('div');
        other.setAttribute('slot', 'middle');
        layout.appendChild(other);
        await nextFrame();
        expect(div.hasAttribute('last-middle-child')).to.be.false;
        expect(other.hasAttribute('last-middle-child')).to.be.true;
      });

      it('should remove first-middle-child attribute when element is removed', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'middle');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('first-middle-child')).to.be.true;

        layout.removeChild(div);
        await nextFrame();
        expect(div.hasAttribute('first-middle-child')).to.be.false;
      });

      it('should remove last-middle-child attribute when element is removed', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'middle');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('last-middle-child')).to.be.true;

        layout.removeChild(div);
        await nextFrame();
        expect(div.hasAttribute('last-middle-child')).to.be.false;
      });
    });

    describe('end', () => {
      it('should set has-end attribute when element added to end slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'end');
        layout.appendChild(div);
        await nextFrame();
        expect(layout.hasAttribute('has-end')).to.be.true;
      });

      it('should remove has-end attribute when element removed from end slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'end');
        layout.appendChild(div);
        await nextFrame();

        layout.removeChild(div);
        await nextFrame();
        expect(layout.hasAttribute('has-end')).to.be.false;
      });

      it('should set first-end-child attribute on first element in the end slot', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'end');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('first-end-child')).to.be.true;

        const other = document.createElement('div');
        other.setAttribute('slot', 'end');
        layout.insertBefore(other, div);
        await nextFrame();
        expect(div.hasAttribute('first-end-child')).to.be.false;
        expect(other.hasAttribute('first-end-child')).to.be.true;
      });

      it('should remove first-end-child attribute when element is removed', async () => {
        const div = document.createElement('div');
        div.setAttribute('slot', 'end');
        layout.appendChild(div);
        await nextFrame();
        expect(div.hasAttribute('first-end-child')).to.be.true;

        layout.removeChild(div);
        await nextFrame();
        expect(div.hasAttribute('first-end-child')).to.be.false;
      });
    });
  });

  describe('wrapping', () => {
    let layout, items;

    beforeEach(() => {
      layout = fixtureSync(`
        <vaadin-horizontal-layout style="flex-wrap: wrap">
          <div style="width: 50px">Div 1</div>
          <div style="width: 50px">Div 1</div>
          <div style="width: 50px">Div 1</div>
          <div style="width: 50px">Div 1</div>
        </vaadin-horizontal-layout>
      `);
      items = [...layout.children];
    });

    it('should set first-in-row on first item in row on layout resize', async () => {
      layout.style.width = '100px';
      await nextResize(layout);
      expect(items[2].hasAttribute('first-in-row')).to.be.true;
    });

    it('should remove first-in-row on first item in row on layout resize', async () => {
      layout.style.width = '100px';
      await nextResize(layout);

      layout.style.width = '200px';
      await nextResize(layout);
      expect(items[2].hasAttribute('first-in-row')).to.be.false;
    });

    it('should update first-in-row on remaining elements when an element is removed', async () => {
      layout.style.width = '100px';
      await nextResize(layout);

      items[0].remove();
      await nextFrame();
      expect(items[2].hasAttribute('first-in-row')).to.be.false;
      expect(items[3].hasAttribute('first-in-row')).to.be.true;
    });

    it('should remove first-in-row from the element when removing it from default slot', async () => {
      layout.style.width = '100px';
      await nextResize(layout);

      items[2].remove();
      await nextFrame();
      expect(items[2].hasAttribute('first-in-row')).to.be.false;
    });

    it('should remove first-in-row from the element when removing it from middle slot', async () => {
      items[2].setAttribute('slot', 'middle');
      items[3].setAttribute('slot', 'middle');

      layout.style.width = '100px';
      await nextResize(layout);

      items[2].remove();
      await nextFrame();
      expect(items[2].hasAttribute('first-in-row')).to.be.false;
    });

    it('should remove first-in-row from the element when removing it from end slot', async () => {
      items[2].setAttribute('slot', 'end');
      items[3].setAttribute('slot', 'end');

      layout.style.width = '100px';
      await nextResize(layout);

      items[2].remove();
      await nextFrame();
      expect(items[2].hasAttribute('first-in-row')).to.be.false;
    });
  });
});
