import { expect } from '@vaadin/chai-plugins';
import { defineLit, fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CheckedMixin } from '../src/checked-mixin.js';
import { InputController } from '../src/input-controller.js';

describe('CheckedMixin', () => {
  const tag = defineLit(
    'checked-mixin',
    `
      <div>
        <slot></slot>
        <slot name="input"></slot>
      </div>
    `,
    (Base) =>
      class extends CheckedMixin(DelegateFocusMixin(PolylitMixin(Base))) {
        constructor() {
          super();

          this._setType('checkbox');
        }

        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this._setFocusElement(input);
              this.stateTarget = input;
            }),
          );
        }
      },
  );

  let element, input, link;

  describe('default', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag}>
          I accept <a href="#">the terms and conditions</a>
        </${tag}>
      `);
      await nextRender();
      link = element.querySelector('a');
      input = element.querySelector('[slot=input]');
    });

    it('should set checked property to false by default', () => {
      expect(element.checked).to.be.false;
    });

    it('should not have checked attribute by default', () => {
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should reflect checked property to the attribute', () => {
      element.checked = true;
      expect(element.hasAttribute('checked')).to.be.true;

      element.checked = false;
      expect(element.hasAttribute('checked')).to.be.false;
    });

    it('should toggle checked property on change', () => {
      input.checked = true;
      fire(input, 'change');
      expect(element.checked).to.be.true;

      input.checked = false;
      fire(input, 'change');
      expect(element.checked).to.be.false;
    });

    it('should toggle checked property on click', () => {
      input.click();
      expect(element.checked).to.be.true;

      input.click();
      expect(element.checked).to.be.false;
    });

    it('should not toggle checked property when clicked a link', () => {
      link.click();
      expect(element.checked).to.be.false;
    });

    it('should not toggle checked property when disabled', () => {
      element.disabled = true;
      input.click();
      expect(element.checked).to.be.false;
    });
  });

  describe('delegation', () => {
    describe('checked property', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} checked></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should delegate checked property to the input', () => {
        expect(input.checked).to.be.true;

        element.checked = false;
        expect(input.checked).to.be.false;
      });
    });
  });
});
