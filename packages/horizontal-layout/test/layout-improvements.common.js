import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';

describe('layout improvements enabled', () => {
  let layout, children;

  describe('flex', () => {
    beforeEach(async () => {
      layout = fixtureSync(`
        <vaadin-horizontal-layout>
          <div></div>
          <div style="width: 100%"></div>
          <div style="height: 50px; width: 100%"></div>
          <div style="min-width: 100%"></div>
        </vaadin-horizontal-layout>
      `);
      children = Array.from(layout.querySelectorAll('*'));
      await nextFrame();
    });

    it('should set flex on full width children only', () => {
      const fullWidthChildren = children.filter((child) => child.style.width === '100%');
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
          <vaadin-button></vaadin-button>
          <vaadin-horizontal-layout></vaadin-horizontal-layout>
          <vaadin-vertical-layout></vaadin-vertical-layout>
        </vaadin-horizontal-layout>
      `);
      children = Array.from(layout.querySelectorAll('*'));
      await nextFrame();
    });

    it('should set min-width on layout components only', () => {
      const layoutChildren = children.filter((child) => child.localName.endsWith('layout'));
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
