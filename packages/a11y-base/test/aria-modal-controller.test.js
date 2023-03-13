import { expect } from '@esm-bundle/chai';
import { defineLit, definePolymer, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { AriaModalController } from '../src/aria-modal-controller.js';

const runTests = (defineHelper, baseMixin) => {
  let wrapper, elements, modal, controller;

  const tag = defineHelper(
    'aria-modal',
    `
      <input id="input-1" />
      <input id="input-2" />
    `,
    (Base) => class extends baseMixin(Base) {},
  );

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <input id="outer-1" />
        <${tag}></${tag}>
        <input id="outer-2" />
      </div>
    `);
    await nextRender();
    elements = wrapper.children;
    modal = elements[1];
    controller = new AriaModalController(modal);
    modal.addController(controller);
  });

  describe('aria-hidden', () => {
    it('should set aria-hidden="true" on other elements when `showModal()` is called', () => {
      controller.showModal();

      expect(elements[0].getAttribute('aria-hidden')).to.equal('true');
      expect(elements[1].hasAttribute('aria-hidden')).to.be.false;
      expect(elements[2].getAttribute('aria-hidden')).to.equal('true');
    });

    it('should remove aria-hidden="true" from other elements when `close()` is called', () => {
      controller.showModal();

      controller.close();

      expect(elements[0].hasAttribute('aria-hidden')).to.be.false;
      expect(elements[1].hasAttribute('aria-hidden')).to.be.false;
      expect(elements[2].hasAttribute('aria-hidden')).to.be.false;
    });
  });
};

describe('AriaModalController + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('AriaModalController + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
