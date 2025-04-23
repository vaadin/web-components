import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../src/vaadin-vertical-layout.js';

describe('vaadin-vertical-layout', () => {
  describe('basic features', () => {
    let layout, tagName;

    beforeEach(() => {
      layout = fixtureSync('<vaadin-vertical-layout></vaadin-vertical-layout>');
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

  describe('outer spacing', () => {
    let wrapper, layout;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-vertical-layout>
            <div>Content</div>
          </vaadin-vertical-layout>
        </div>
      `);
      layout = wrapper.firstElementChild;
    });

    it('should not occupy space outside when applying theme="spacing"', () => {
      layout.setAttribute('theme', 'spacing');
      wrapper.style.height = '200px';
      layout.style.minHeight = '200px';
      expect(wrapper.scrollHeight).to.equal(200);
    });
  });

  describe('layout improvements disabled', () => {
    let layout, children;

    describe('flex', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-vertical-layout>
            <div></div>
            <div data-height-full></div>
          </vaadin-vertical-layout>
        `);
        children = Array.from(layout.children);
        await nextFrame();
      });

      it('should not set flex on any children', () => {
        children.forEach((child) => {
          expect(getComputedStyle(child).flex).to.equal('0 1 auto');
        });
      });
    });

    describe('min-height', () => {
      beforeEach(async () => {
        layout = fixtureSync(`
          <vaadin-vertical-layout>
            <div></div>
            <div data-height-full></div>
            <vaadin-button></vaadin-button>
            <vaadin-button data-height-full></vaadin-button>
            <vaadin-horizontal-layout></vaadin-horizontal-layout>
            <vaadin-horizontal-layout data-height-full></vaadin-horizontal-layout>
            <vaadin-vertical-layout></vaadin-vertical-layout>
            <vaadin-vertical-layout data-height-full></vaadin-vertical-layout>
          </vaadin-vertical-layout>
        `);
        children = Array.from(layout.children);
        await nextFrame();
      });

      it('should not set min-height on any children', () => {
        children.forEach((child) => {
          expect(getComputedStyle(child).minHeight).to.equal('auto');
        });
      });
    });
  });
});
