import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import './enable-layout-improvements.js';
import '../src/vaadin-vertical-layout.js';

describe('layout improvements enabled', () => {
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

    it('should set flex on full height children only', () => {
      const fullHeightChildren = children.filter((child) => child.hasAttribute('data-height-full'));
      const remainingChildren = children.filter((child) => !fullHeightChildren.includes(child));

      fullHeightChildren.forEach((child) => {
        expect(getComputedStyle(child).flex).to.equal('1 1 0%');
      });
      remainingChildren.forEach((child) => {
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

    it('should set min-height on layout components with full height only', () => {
      const layoutChildren = children.filter(
        (child) => child.localName.endsWith('layout') && child.hasAttribute('data-height-full'),
      );
      const remainingChildren = children.filter((child) => !layoutChildren.includes(child));

      layoutChildren.forEach((child) => {
        expect(getComputedStyle(child).minHeight).to.equal('0px');
      });

      remainingChildren.forEach((child) => {
        expect(getComputedStyle(child).minHeight).to.equal('auto');
      });
    });
  });
});
