import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

describe('layout improvements enabled', () => {
  let layout, children;

  describe('flex', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-horizontal-layout>
          <div></div>
          <div data-full-width></div>
        </vaadin-horizontal-layout>
      `);
      children = Array.from(layout.children);
      await nextFrame();
    });

    it('should set flex on full width children only', () => {
      const fullWidthChildren = children.filter((child) => child.hasAttribute('data-full-width'));
      const remainingChildren = children.filter((child) => !fullWidthChildren.includes(child));

      fullWidthChildren.forEach((child) => {
        expect(getComputedStyle(child).flex).to.equal('1 1 0%');
      });
      remainingChildren.forEach((child) => {
        expect(getComputedStyle(child).flex).to.equal('0 1 auto');
      });
    });
  });

  describe('min-width', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-horizontal-layout>
          <div></div>
          <div data-full-width></div>
          <vaadin-button></vaadin-button>
          <vaadin-button data-full-width></vaadin-button>
          <vaadin-horizontal-layout></vaadin-horizontal-layout>
          <vaadin-horizontal-layout data-full-width></vaadin-horizontal-layout>
          <vaadin-vertical-layout></vaadin-vertical-layout>
          <vaadin-vertical-layout data-full-width></vaadin-vertical-layout>
        </vaadin-horizontal-layout>
      `);
      children = Array.from(layout.children);
      await nextFrame();
    });

    it('should set min-width on layout components with full width only', () => {
      const layoutChildren = children.filter(
        (child) => child.localName.endsWith('layout') && child.hasAttribute('data-full-width'),
      );
      const remainingChildren = children.filter((child) => !layoutChildren.includes(child));

      layoutChildren.forEach((child) => {
        expect(getComputedStyle(child).minWidth).to.equal('0px');
      });

      remainingChildren.forEach((child) => {
        expect(getComputedStyle(child).minWidth).to.equal('auto');
      });
    });
  });
});
