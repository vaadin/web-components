import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

describe('layout improvements enabled', () => {
  let layout, children;

  describe('flex', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-vertical-layout>
          <div></div>
          <div style="height: 100%"></div>
          <div style="height: 50px; height: 100%"></div>
          <div style="min-height: 100%"></div>
        </vaadin-vertical-layout>
      `);
      children = Array.from(layout.querySelectorAll('*'));
      await nextFrame();
    });

    it('should set flex on full width children only', () => {
      const fullWidthChildren = children.filter((child) => child.style.height === '100%');
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
        <vaadin-vertical-layout>
          <div></div>
          <vaadin-button></vaadin-button>
          <vaadin-horizontal-layout></vaadin-horizontal-layout>
          <vaadin-vertical-layout></vaadin-vertical-layout>
        </vaadin-vertical-layout>
      `);
      children = Array.from(layout.querySelectorAll('*'));
      await nextFrame();
    });

    it('should set min-width on layout components only', () => {
      const layoutChildren = children.filter((child) => child.localName.endsWith('layout'));
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
