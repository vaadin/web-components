import { expect } from '@vaadin/chai-plugins';
import { definePolymer, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { InputMixin } from '../src/input-mixin.js';
import { LabelMixin } from '../src/label-mixin.js';
import { LabelledInputController } from '../src/labelled-input-controller.js';

describe('LabelledInputController', () => {
  const inputTag = definePolymer(
    'input',
    `<slot name="label"></slot><slot name="input"></slot>`,
    (Base) => class extends InputMixin(LabelMixin(ControllerMixin(Base))) {},
  );

  const textareaTag = definePolymer(
    'textarea',
    `<slot name="label"></slot><slot name="textarea"></slot>`,
    (Base) => class extends InputMixin(LabelMixin(ControllerMixin(Base))) {},
  );

  let element, target, label;

  Object.entries({ input: inputTag, textarea: textareaTag }).forEach(([el, tag]) => {
    describe(el, () => {
      beforeEach(() => {
        element = fixtureSync(`<${tag} label="label"></${tag}>`);
        label = element.querySelector('[slot=label]');
        target = document.createElement(el);
        target.setAttribute('slot', el);
        element.appendChild(target);
        element._setInputElement(target);
        element.addController(new LabelledInputController(target, element._labelController));
      });

      it('should set for attribute on the label', () => {
        expect(label.getAttribute('for')).to.equal(target.id);
      });

      it('should only run click handler once on label click', () => {
        const spy = sinon.spy();
        element.addEventListener('click', spy);
        label.click();
        expect(spy.calledOnce).to.be.true;
      });

      describe('lazy label', () => {
        let lazyLabel;

        beforeEach(async () => {
          lazyLabel = document.createElement('label');
          lazyLabel.setAttribute('slot', 'label');
          lazyLabel.textContent = 'Lazy';
          element.appendChild(lazyLabel);
          await nextFrame();
        });

        it('should set for attribute on the lazily added label', () => {
          expect(lazyLabel.getAttribute('for')).to.equal(target.id);
        });

        it('should only run click handler once on lazy label click', () => {
          const spy = sinon.spy();
          element.addEventListener('click', spy);
          lazyLabel.click();
          expect(spy.calledOnce).to.be.true;
        });
      });
    });
  });
});
