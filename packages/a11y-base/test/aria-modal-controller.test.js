import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { AriaModalController } from '../src/aria-modal-controller.js';

describe('AriaModalController', () => {
  let wrapper, elements, modal, controller;

  const tag = definePolymer('aria-modal', '<slot></slot>', (Base) => class extends ControllerMixin(Base) {});

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <input id="outer-1" />
        <${tag}>
          <input id="input-1" />
          <input id="input-2" />
          <input id="input-3" />
        </${tag}>
        <input id="outer-2" />
      </div>
    `);
    await nextRender();
    elements = wrapper.children;
    modal = elements[1];
  });

  describe('aria-hidden', () => {
    describe('default', () => {
      beforeEach(() => {
        controller = new AriaModalController(modal);
        modal.addController(controller);
      });

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

    describe('callback', () => {
      let inputs;

      beforeEach(() => {
        inputs = [...modal.children];
      });

      it('should accept callback to provide single element to set aria-hidden="true"', () => {
        controller = new AriaModalController(modal, () => inputs[0]);
        modal.addController(controller);

        controller.showModal();

        expect(inputs[0].hasAttribute('aria-hidden')).to.be.false;
        expect(inputs[1].getAttribute('aria-hidden')).to.equal('true');
        expect(inputs[2].getAttribute('aria-hidden')).to.equal('true');
      });

      it('should accept callback to provide multiple elements to set aria-hidden="true"', () => {
        controller = new AriaModalController(modal, () => inputs.slice(1));
        modal.addController(controller);

        controller.showModal();

        expect(inputs[0].getAttribute('aria-hidden')).to.equal('true');
        expect(inputs[1].hasAttribute('aria-hidden')).to.be.false;
        expect(inputs[2].hasAttribute('aria-hidden')).to.be.false;
      });
    });
  });
});
