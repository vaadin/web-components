import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FieldMixin } from '../src/field-mixin.js';
import { InputMixin } from '../src/input-mixin.js';
import { InputController } from '../src/input-controller.js';

customElements.define(
  'field-mixin-element',
  class extends FieldMixin(InputMixin(ElementMixin(PolymerElement))) {
    static get template() {
      return html`
        <style>
          :host {
            display: block;
          }

          /* Mimic Lumo styles to test resize */
          [part='error-message'] {
            max-height: 5em;
          }

          :host(:not([invalid])) [part='error-message'] {
            max-height: 0;
            overflow: hidden;
          }
        </style>
        <div part="label">
          <slot name="label"></slot>
        </div>
        <slot name="input"></slot>
        <button id="clearButton">Clear</button>
        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
        <slot name="helper"></slot>
      `;
    }

    constructor() {
      super();

      this.addController(
        new InputController(this, (input) => {
          this._setInputElement(input);
          this.stateTarget = input;
          this.ariaTarget = input;
        })
      );
    }
  }
);

customElements.define(
  'field-mixin-group-element',
  class extends FieldMixin(PolymerElement) {
    static get template() {
      return html`
        <slot name="label"></slot>
        <slot name="error-message"></slot>
        <slot name="helper"></slot>
      `;
    }

    get _ariaAttr() {
      return 'aria-labelledby';
    }

    ready() {
      super.ready();

      this.ariaTarget = this;
    }
  }
);

describe('field-mixin', () => {
  let element, label, error, helper, input;

  describe('error message', () => {
    const ID_REGEX = /^error-field-mixin-element-\d+$/;

    describe('default', () => {
      beforeEach(() => {
        element = fixtureSync(`<field-mixin-element></field-mixin-element>`);
        error = element.querySelector('[slot=error-message]');
        element.invalid = true;
      });

      it('should create an error message element', () => {
        expect(error).to.be.an.instanceof(HTMLDivElement);
      });

      it('should set aria-live attribute on the error message', () => {
        expect(error.getAttribute('aria-live')).to.equal('assertive');
      });

      it('should set id on the error message element', () => {
        const id = error.getAttribute('id');
        expect(id).to.match(ID_REGEX);
        expect(id.endsWith(element.constructor._uniqueFieldId)).to.be.true;
      });

      it('should update error message content on attribute change', () => {
        element.setAttribute('error-message', 'This field is required');
        expect(error.textContent).to.equal('This field is required');
      });

      it('should update error message content on property change', () => {
        element.errorMessage = 'This field is required';
        expect(error.textContent).to.equal('This field is required');
      });

      it('should clear error message content when field is valid', () => {
        element.errorMessage = 'This field is required';
        element.invalid = false;
        expect(error.textContent).to.equal('');
      });

      it('should not set has-error-message attribute with no error', () => {
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should set has-error-message attribute when attribute is set', () => {
        element.setAttribute('error-message', 'This field is required');
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should set has-error-message attribute when property is set', () => {
        element.errorMessage = 'This field is required';
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should remove has-error-message attribute when field is valid', () => {
        element.errorMessage = 'This field is required';
        element.invalid = false;
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });
    });

    describe('attribute', () => {
      beforeEach(() => {
        element = fixtureSync(`
        <field-mixin-element
          invalid
          error-message="This field is required"
        ></field-mixin-element>
      `);
        error = element.querySelector('[slot=error-message]');
      });

      it('should set error-message text content from attribute', () => {
        expect(error.textContent).to.equal('This field is required');
      });

      it('should set has-error-message attribute on the host', () => {
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });
    });

    describe('slotted', () => {
      beforeEach(() => {
        element = fixtureSync(`
        <field-mixin-element>
          <div slot="error-message">Required field</div>
        </field-mixin-element>
      `);
        error = element.querySelector('[slot=error-message]');
        element.invalid = true;
      });

      it('should return slotted message content as an errorMessage', () => {
        expect(element.errorMessage).to.equal('Required field');
      });

      it('should set id on the slotted error message element', () => {
        const id = error.getAttribute('id');
        expect(id).to.match(ID_REGEX);
        expect(id.endsWith(element.constructor._uniqueFieldId)).to.be.true;
      });

      it('should set has-error-message attribute with slotted error message', () => {
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should update slotted error message content on property change', () => {
        element.errorMessage = 'This field is required';
        expect(error.textContent).to.equal('This field is required');
      });
    });
  });

  describe('helper', () => {
    let element, helper;

    const ID_REGEX = /^helper-field-mixin-element-\d+$/;

    describe('default', () => {
      beforeEach(() => {
        element = fixtureSync(`<field-mixin-element></field-mixin-element>`);
        helper = element.querySelector('[slot=helper]');
      });

      it('should not create a helper element by default', () => {
        expect(helper).to.be.not.ok;
      });

      it('should add a helper when helperText property is set', () => {
        element.helperText = '3 digits';
        helper = element.querySelector('[slot=helper]');
        expect(helper).to.be.an.instanceof(HTMLDivElement);
      });

      it('should add a helper when helper-text attribute is set', () => {
        element.setAttribute('helper-text', '3 digits');
        helper = element.querySelector('[slot=helper]');
        expect(helper).to.be.an.instanceof(HTMLDivElement);
      });

      it('should not set has-helper attribute with no helper', () => {
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should set has-helper attribute when attribute is set', () => {
        element.setAttribute('helper-text', '3 digits');
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should set has-helper attribute when property is set', () => {
        element.helperText = '3 digits';
        expect(element.hasAttribute('has-helper')).to.be.true;
      });
    });

    describe('property', () => {
      beforeEach(() => {
        element = fixtureSync(`<field-mixin-element></field-mixin-element>`);
        element.helperText = 'Positive number';
        helper = element.querySelector('[slot=helper]');
      });

      it('should set slot on the generated helper element', () => {
        expect(helper.getAttribute('slot')).to.equal('helper');
      });

      it('should set id on the generated helper element', () => {
        const id = helper.getAttribute('id');
        expect(id).to.match(ID_REGEX);
        expect(id.endsWith(element.constructor._uniqueFieldId)).to.be.true;
      });

      it('should set content to the generated helper element', () => {
        expect(helper.textContent).to.equal('Positive number');
      });

      it('should update helper content on attribute change', () => {
        element.setAttribute('helper-text', '3 digits');
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should update helper content on property change', () => {
        element.helperText = '3 digits';
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should remove has-helper attribute when property is unset', () => {
        element.helperText = '';
        expect(element.hasAttribute('has-helper')).to.be.false;
      });
    });

    describe('attribute', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <field-mixin-element
            helper-text="3 digits"
          ></field-mixin-element>
        `);
        helper = element.querySelector('[slot=helper]');
      });

      it('should set helper text content from attribute', () => {
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should remove has-helper attribute when attribute is removed', () => {
        element.removeAttribute('helper-text');
        expect(element.hasAttribute('has-helper')).to.be.false;
      });
    });

    describe('slotted', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <field-mixin-element>
            <div slot="helper">Custom</div>
          </field-mixin-element>
        `);
        helper = element.querySelector('[slot=helper]');
      });

      it('should not return slotted helper content as a helperText', () => {
        expect(element.helperText).to.be.not.ok;
      });

      it('should set id on the slotted helper element', () => {
        const id = helper.getAttribute('id');
        expect(id).to.match(ID_REGEX);
        expect(id.endsWith(element.constructor._uniqueFieldId)).to.be.true;
      });

      it('should set has-helper attribute with slotted helper', () => {
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should not update slotted helper content on property change', () => {
        element.helperText = '3 digits';
        expect(helper.textContent).to.not.equal('3 digits');
      });
    });

    describe('slotted empty', () => {
      beforeEach(() => {
        element = fixtureSync(`
          <field-mixin-element>
            <div slot="helper"><span></span></div>
          </field-mixin-element>
        `);
      });

      it('should set has-helper attribute when helper children are empty', () => {
        expect(element.hasAttribute('has-helper')).to.be.true;
      });
    });

    describe('lazy', () => {
      describe('DOM manipulations', () => {
        let defaultHelper;

        beforeEach(async () => {
          element = fixtureSync('<field-mixin-element></field-mixin-element>');
          element.helperText = 'Default helper';
          await nextFrame();
          defaultHelper = element._helperNode;
          helper = document.createElement('div');
          helper.setAttribute('slot', 'helper');
          helper.textContent = 'Lazy';
        });

        it('should handle lazy helper added using appendChild', async () => {
          element.appendChild(helper);
          await nextFrame();
          expect(element._helperNode).to.equal(helper);
        });

        it('should handle lazy helper added using insertBefore', async () => {
          element.insertBefore(helper, defaultHelper);
          await nextFrame();
          expect(element._helperNode).to.equal(helper);
        });

        it('should handle lazy helper added using replaceChild', async () => {
          element.replaceChild(helper, defaultHelper);
          await nextFrame();
          expect(element._helperNode).to.equal(helper);
        });

        it('should remove the default helper from the element when using appendChild', async () => {
          element.appendChild(helper);
          await nextFrame();
          expect(defaultHelper.parentNode).to.be.null;
        });

        it('should remove the default helper from the element when using insertBefore', async () => {
          element.insertBefore(helper, defaultHelper);
          await nextFrame();
          expect(defaultHelper.parentNode).to.be.null;
        });

        it('should support replacing lazy helper with a new one using appendChild', async () => {
          element.appendChild(helper);
          await nextFrame();

          const div = document.createElement('div');
          div.setAttribute('slot', 'helper');
          div.textContent = 'New';
          element.appendChild(div);
          await nextFrame();
          expect(element._helperNode).to.equal(div);
        });

        it('should support replacing lazy helper with a new one using insertBefore', async () => {
          element.appendChild(helper);
          await nextFrame();

          const div = document.createElement('div');
          div.setAttribute('slot', 'helper');
          div.textContent = 'New';
          element.insertBefore(div, helper);
          await nextFrame();
          expect(element._helperNode).to.equal(div);
        });

        it('should support replacing lazy helper with a new one using replaceChild', async () => {
          element.appendChild(helper);
          await nextFrame();

          const div = document.createElement('div');
          div.setAttribute('slot', 'helper');
          div.textContent = 'New';
          element.replaceChild(div, helper);
          await nextFrame();
          expect(element._helperNode).to.equal(div);
        });
      });

      describe('ID attribute', () => {
        beforeEach(async () => {
          element = fixtureSync('<field-mixin-element></field-mixin-element>');
          element.helperText = 'Default';
          await nextFrame();
          helper = document.createElement('div');
          helper.setAttribute('slot', 'helper');
          helper.textContent = 'Lazy';
        });

        it('should set id on the lazily added helper element', async () => {
          element.appendChild(helper);
          await nextFrame();
          expect(helper.getAttribute('id')).to.match(ID_REGEX);
        });

        it('should not override custom id on the lazily added helper', async () => {
          helper.id = 'helper-component';
          element.appendChild(helper);
          await nextFrame();
          expect(helper.getAttribute('id')).to.equal('helper-component');
        });

        it('should restore default id if the custom helper id is removed', async () => {
          helper.id = 'helper-component';
          element.appendChild(helper);
          await nextFrame();
          helper.removeAttribute('id');
          await nextFrame();
          expect(helper.getAttribute('id')).to.match(ID_REGEX);
        });

        it('should apply helper text if the custom helper is removed', async () => {
          element.appendChild(helper);
          await nextFrame();
          element.helperText = 'Default';
          element.removeChild(helper);
          await nextFrame();
          const defaultHelper = element.querySelector('[slot="helper"]');
          expect(defaultHelper.textContent).to.equal('Default');
        });
      });

      describe('attributes', () => {
        beforeEach(async () => {
          element = fixtureSync('<field-mixin-element></field-mixin-element>');
          element.helperText = 'Default';
          await nextFrame();
          helper = document.createElement('div');
          helper.setAttribute('slot', 'helper');
          helper.textContent = 'Lazy';
          element.appendChild(helper);
          await nextFrame();
        });

        it('should store a reference to the lazily added helper', () => {
          expect(element._helperNode).to.equal(helper);
        });

        it('should set has-helper attribute with lazy helper', () => {
          expect(element.hasAttribute('has-helper')).to.be.true;
        });

        it('should not update lazy helper content on property change', () => {
          element.helperText = '3 digits';
          expect(helper.textContent).to.equal('Lazy');
        });
      });
    });
  });

  describe('aria-describedby', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-mixin-element helper-text="Helper"></field-mixin-element>`);
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      helper = element.querySelector('[slot=helper]');
      input = element.querySelector('[slot=input]');
    });

    it('should only add helper text to aria-describedby when field is valid', () => {
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
      expect(aria).to.not.include(label.id);
    });

    it('should add error message to aria-describedby when field is invalid', () => {
      element.invalid = true;
      const aria = input.getAttribute('aria-describedby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
      expect(aria).to.not.include(label.id);
    });
  });

  describe('aria-labelledby', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-mixin-group-element helper-text="Helper"></field-mixin-group-element>`);
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      helper = element.querySelector('[slot=helper]');
    });

    it('should add label and helper text to aria-labelledby when field is valid', () => {
      const aria = element.getAttribute('aria-labelledby');
      expect(aria).to.include(helper.id);
      expect(aria).to.not.include(error.id);
      expect(aria).to.include(label.id);
    });

    it('should add error message to aria-labelledby when field is invalid', () => {
      element.invalid = true;
      const aria = element.getAttribute('aria-labelledby');
      expect(aria).to.include(helper.id);
      expect(aria).to.include(error.id);
      expect(aria).to.include(label.id);
    });
  });

  describe('custom helper', () => {
    beforeEach(() => {
      element = fixtureSync(`<field-mixin-element></field-mixin-element>`);
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      input = element.querySelector('[slot=input]');
    });

    it('should handle custom id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      element.appendChild(helper);
      await nextFrame();
      expect(input.getAttribute('aria-describedby')).to.include('helper-component');
    });

    it('should handle restored id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      element.appendChild(helper);
      await nextFrame();
      helper.removeAttribute('id');
      expect(input.getAttribute('aria-describedby')).to.include(helper.id);
    });
  });

  describe('iron-resize', () => {
    let spy;

    function flushObserveHeight(field) {
      field.__observeOffsetHeightDebouncer.flush();
    }

    beforeEach(() => {
      element = fixtureSync('<field-mixin-element></field-mixin-element>');
      spy = sinon.spy();
      element.addEventListener('iron-resize', spy);
    });

    it('should not dispatch `iron-resize` event on init', () => {
      expect(spy.called).to.be.false;
    });

    it('should dispatch `iron-resize` event on invalid height change', () => {
      element.errorMessage = 'Error';
      flushObserveHeight(element);
      element.invalid = true;
      flushObserveHeight(element);
      expect(spy.called).to.be.true;
    });

    it('should be a composed event', () => {
      element.errorMessage = 'Error';
      flushObserveHeight(element);
      element.invalid = true;
      flushObserveHeight(element);
      const event = spy.lastCall.lastArg;
      expect(event.composed).to.be.true;
    });

    it('should dispatch `iron-resize` event on error message height change', () => {
      element.errorMessage = 'Error';
      flushObserveHeight(element);
      element.invalid = true;
      flushObserveHeight(element);
      spy.resetHistory();

      // Long message that spans on multiple lines
      element.errorMessage = [...new Array(42)].map(() => 'bla').join(' ');
      flushObserveHeight(element);

      expect(spy.calledOnce).to.be.true;
    });

    it('should dispatch `iron-resize` event on label height change', () => {
      flushObserveHeight(element);
      element.label = 'Label';
      flushObserveHeight(element);
      expect(spy.calledOnce).to.be.true;
    });
  });
});
