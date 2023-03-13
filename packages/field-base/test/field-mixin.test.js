import { expect } from '@esm-bundle/chai';
import { aTimeout, defineLit, definePolymer, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FieldMixin } from '../src/field-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputMixin } from '../src/input-mixin.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'field-mixin',
    `
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
    `,
    (Base) =>
      class extends FieldMixin(InputMixin(baseMixin(Base))) {
        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this.stateTarget = input;
              this.ariaTarget = input;
            }),
          );
        }
      },
  );

  const groupTag = defineHelper(
    'field-mixin-group',
    `
      <slot name="label"></slot>
      <slot name="error-message"></slot>
      <slot name="helper"></slot>
    `,
    (Base) =>
      class extends FieldMixin(baseMixin(Base)) {
        ready() {
          super.ready();

          this.ariaTarget = this;
        }
      },
  );

  let element, label, error, helper, input;

  describe('error message', () => {
    const ID_REGEX = new RegExp(`^error-message-${tag}-\\d+$`, 'u');

    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        element.invalid = true;
        await nextRender();
        error = element.querySelector('[slot=error-message]');
      });

      it('should create an error message element', () => {
        expect(error).to.be.an.instanceof(HTMLDivElement);
      });

      it('should update error message content on attribute change', async () => {
        element.setAttribute('error-message', 'This field is required');
        await nextFrame();
        expect(error.textContent).to.equal('This field is required');
      });

      it('should update error message content on property change', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();
        expect(error.textContent).to.equal('This field is required');
      });

      it('should clear error message content when field is valid', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();

        element.invalid = false;
        await nextFrame();
        expect(error.textContent).to.equal('');
      });

      it('should not set has-error-message attribute with no error', () => {
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should not set has-error-message attribute when the property is an empty string', async () => {
        element.errorMessage = '';
        await nextFrame();
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should not set has-error-message attribute when the property is null', async () => {
        element.errorMessage = null;
        await nextFrame();
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should set has-error-message attribute when attribute is set', async () => {
        element.setAttribute('error-message', 'This field is required');
        await nextFrame();
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should set has-error-message attribute when property is set', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should remove has-error-message attribute when field is valid', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();

        element.invalid = false;
        await nextFrame();
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should not set alert role with no error', () => {
        expect(error.hasAttribute('role')).to.be.false;
      });

      it('should set alert role when attribute is set', async () => {
        element.setAttribute('error-message', 'This field is required');
        await nextFrame();
        expect(error.getAttribute('role')).to.equal('alert');
      });

      it('should set alert role when property is set', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();
        expect(error.getAttribute('role')).to.equal('alert');
      });

      it('should remove alert role when field is valid', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();

        element.invalid = false;
        await nextFrame();
        expect(error.hasAttribute('role')).to.be.false;
      });
    });

    describe('unique id', () => {
      let error1, error2;

      beforeEach(async () => {
        const element1 = fixtureSync(`<${tag} error-message="Error 1"></${tag}>`);
        const element2 = fixtureSync(`<${tag} error-message="Error 2"></${tag}>`);
        await nextRender();
        error1 = element1.querySelector('[slot=error-message]');
        error2 = element2.querySelector('[slot=error-message]');
      });

      it('should set a unique id on the error message element', () => {
        expect(error1.id).to.not.equal(error2.id);
        expect(error1.id).to.match(ID_REGEX);
        expect(error2.id).to.match(ID_REGEX);
      });
    });

    describe('attribute', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}
            invalid
            error-message="This field is required"
          ></${tag}>
        `);
        await nextRender();
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
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <div slot="error-message">Required field</div>
          ></${tag}>
        `);
        element.invalid = true;
        await nextRender();
        error = element.querySelector('[slot=error-message]');
      });

      it('should not return return slotted message content as an errorMessage', () => {
        expect(element.errorMessage).to.be.not.ok;
      });

      it('should set id on the slotted error message element', () => {
        expect(error.id).to.match(ID_REGEX);
      });

      it('should set has-error-message attribute with slotted error message', () => {
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should update slotted error message content on property change', async () => {
        element.errorMessage = 'This field is required';
        await nextFrame();
        expect(error.textContent).to.equal('This field is required');
      });
    });
  });

  describe('helper', () => {
    let element, helper;

    const ID_REGEX = new RegExp(`^helper-${tag}-\\d+$`, 'u');

    describe('default', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        helper = element.querySelector('[slot=helper]');
      });

      it('should not create a helper element by default', () => {
        expect(helper).to.be.not.ok;
      });

      it('should add a helper when helperText property is set', async () => {
        element.helperText = '3 digits';
        await nextFrame();
        helper = element.querySelector('[slot=helper]');
        expect(helper).to.be.an.instanceof(HTMLDivElement);
      });

      it('should add a helper when helper-text attribute is set', async () => {
        element.setAttribute('helper-text', '3 digits');
        await nextFrame();
        helper = element.querySelector('[slot=helper]');
        expect(helper).to.be.an.instanceof(HTMLDivElement);
      });

      it('should not set has-helper attribute with no helper', () => {
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should set has-helper attribute when attribute is set', async () => {
        element.setAttribute('helper-text', '3 digits');
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should set has-helper attribute when property is set', async () => {
        element.helperText = '3 digits';
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should not add a helper when helperText is whitespace string', async () => {
        element.helperText = ' ';
        await nextFrame();
        expect(element.querySelector('[slot=helper]')).to.be.not.ok;
      });

      it('should not set has-helper when helperText is whitespace string', async () => {
        element.helperText = ' ';
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should clear helper when helperText is set to empty string', async () => {
        element.helperText = '3 digits';
        await nextFrame();
        helper = element.querySelector('[slot=helper]');

        element.helperText = '';
        await nextFrame();
        expect(helper.textContent).to.equal('');
      });

      it('should remove has-helper attribute when helperText is cleared', async () => {
        element.helperText = '3 digits';
        await nextFrame();
        helper = element.querySelector('[slot=helper]');

        element.helperText = '';
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.false;
      });
    });

    describe('unique id', () => {
      let helper1, helper2;

      beforeEach(async () => {
        const element1 = fixtureSync(`<${tag} helper-text="Helper 1"></${tag}>`);
        const element2 = fixtureSync(`<${tag} helper-text="Helper 2"></${tag}>`);
        await nextRender();
        helper1 = element1.querySelector('[slot=helper]');
        helper2 = element2.querySelector('[slot=helper]');
      });

      it('should set a unique id on the helper element', () => {
        expect(helper1.id).to.not.equal(helper2.id);
        expect(helper1.id).to.match(ID_REGEX);
        expect(helper2.id).to.match(ID_REGEX);
      });
    });

    describe('property', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        element.helperText = 'Positive number';
        await nextRender();
        helper = element.querySelector('[slot=helper]');
      });

      it('should set slot on the generated helper element', () => {
        expect(helper.getAttribute('slot')).to.equal('helper');
      });

      it('should set content to the generated helper element', () => {
        expect(helper.textContent).to.equal('Positive number');
      });

      it('should update helper content on attribute change', async () => {
        element.setAttribute('helper-text', '3 digits');
        await nextFrame();
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should update helper content on property change', async () => {
        element.helperText = '3 digits';
        await nextFrame();
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should remove has-helper attribute when property is unset', async () => {
        element.helperText = '';
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should remove has-helper attribute when property is null', async () => {
        element.helperText = null;
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.false;
      });
    });

    describe('attribute', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} helper-text="3 digits"></${tag}>`);
        await nextRender();
        helper = element.querySelector('[slot=helper]');
      });

      it('should set helper text content from attribute', () => {
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should remove has-helper attribute when attribute is removed', async () => {
        element.removeAttribute('helper-text');
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.false;
      });
    });

    describe('slotted', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <div slot="helper">Custom</div>
          </${tag}>
        `);
        await nextRender();
        helper = element.querySelector('[slot=helper]');
      });

      it('should not return slotted helper content as a helperText', () => {
        expect(element.helperText).to.be.not.ok;
      });

      it('should set id on the slotted helper element', () => {
        expect(helper.id).to.match(ID_REGEX);
      });

      it('should set has-helper attribute with slotted helper', () => {
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should not update slotted helper content on property change', async () => {
        element.helperText = '3 digits';
        await nextFrame();
        expect(helper.textContent).to.not.equal('3 digits');
      });

      it('should remove has-helper attribute when slotted helper is removed', async () => {
        element.removeChild(helper);
        await nextFrame();
        expect(element.hasAttribute('has-helper')).to.be.false;
      });
    });

    describe('slotted with property', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag} helper-text="Default">
            <div slot="helper">Custom</div>
          </${tag}>
        `);
        await nextRender();
        helper = element.querySelector('[slot=helper]');
      });

      it('should not override slotted helper with property on attach', () => {
        expect(helper.textContent).to.equal('Custom');
      });
    });

    describe('slotted empty', () => {
      beforeEach(async () => {
        element = fixtureSync(`
          <${tag}>
            <div slot="helper"><span></span></div>
          </${tag}>
        `);
        await nextRender();
      });

      it('should set has-helper attribute when helper children are empty', () => {
        expect(element.hasAttribute('has-helper')).to.be.true;
      });
    });

    describe('slotted custom element', () => {
      beforeEach(async () => {
        const helperTag = defineHelper('custom-helper', '<div>Helper</div>', (Base) => Base);
        element = fixtureSync(`
          <${tag}>
            <${helperTag} slot="helper"></${helperTag}>
          </${tag}>
        `);
        await nextRender();
      });

      it('should set has-helper attribute when helper is a custom element', () => {
        expect(element.hasAttribute('has-helper')).to.be.true;
      });
    });

    describe('lazy', () => {
      describe('DOM manipulations', () => {
        let defaultHelper;

        beforeEach(async () => {
          element = fixtureSync(`<${tag}></${tag}>`);
          element.helperText = 'Default helper';
          await nextRender();
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

        it('should support adding lazy helper after removing the default one', async () => {
          element.removeChild(defaultHelper);
          await nextFrame();

          element.appendChild(helper);
          await nextFrame();

          expect(element._helperNode).to.equal(helper);
        });

        it('should restore the default helper when helperText property is set', async () => {
          element.appendChild(helper);
          await nextFrame();

          element.removeChild(helper);
          await nextFrame();
          expect(element._helperNode).to.equal(defaultHelper);
        });

        it('should restore the default helper when helperText property is restored', async () => {
          element.appendChild(helper);
          await nextFrame();

          element.helperText = '';

          element.removeChild(helper);
          await nextFrame();

          element.helperText = 'Helper';
          await nextFrame();
          expect(element._helperNode).to.equal(defaultHelper);
        });

        it('should keep has-helper attribute when the default helper is restored', async () => {
          element.appendChild(helper);
          await nextFrame();

          element.removeChild(helper);
          await nextFrame();
          expect(element.hasAttribute('has-helper')).to.be.true;
        });

        it('should remove has-helper attribute when helperText is set to empty', async () => {
          element.appendChild(helper);
          await nextFrame();

          element.helperText = '';

          element.removeChild(helper);
          await nextFrame();
          expect(element.hasAttribute('has-helper')).to.be.false;
        });
      });

      describe('ID attribute', () => {
        beforeEach(async () => {
          element = fixtureSync(`<${tag}></${tag}>`);
          element.helperText = 'Default';
          await nextRender();
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
          element = fixtureSync(`<${tag}></${tag}>`);
          element.helperText = 'Default';
          await nextRender();
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

  describe('aria', () => {
    describe('field', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} label="Label" helper-text="Helper" error-message="Error Message"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
        label = element.querySelector('[slot=label]');
        error = element.querySelector('[slot=error-message]');
        helper = element.querySelector('[slot=helper]');
      });

      describe('aria-labelledby', () => {
        it('should only contain label id when the field is valid', () => {
          const aria = input.getAttribute('aria-labelledby');
          expect(aria).to.equal(label.id);
        });

        it('should only contain label id when the field is invalid', async () => {
          element.invalid = true;
          await nextFrame();
          const aria = input.getAttribute('aria-labelledby');
          expect(aria).to.equal(label.id);
        });
      });

      describe('aria-describedby', () => {
        it('should only contain helper id when the field is valid', () => {
          const aria = input.getAttribute('aria-describedby');
          expect(aria).to.equal(helper.id);
        });

        it('should add error id asynchronously after the field becomes invalid', async () => {
          element.invalid = true;
          await nextFrame();
          await aTimeout(0);
          const aria = input.getAttribute('aria-describedby');
          expect(aria).to.include(helper.id);
          expect(aria).to.include(error.id);
          expect(aria).to.not.include(label.id);
        });
      });
    });

    describe('field group', () => {
      beforeEach(async () => {
        element = fixtureSync(
          `<${groupTag} label="Label" helper-text="Helper" error-message="Error Message"></${groupTag}>`,
        );
        await nextRender();
        label = element.querySelector('[slot=label]');
        error = element.querySelector('[slot=error-message]');
        helper = element.querySelector('[slot=helper]');
      });

      describe('aria-labelledby', () => {
        it('should only contain label id and helper id when the field is valid', () => {
          const aria = element.getAttribute('aria-labelledby');
          expect(aria).to.include(label.id);
          expect(aria).to.include(helper.id);
          expect(aria).to.not.include(error.id);
        });

        it('should add error id asynchronously after the field becomes invalid', async () => {
          element.invalid = true;
          await nextFrame();
          await aTimeout(0);
          const aria = element.getAttribute('aria-labelledby');
          expect(aria).to.include(label.id);
          expect(aria).to.include(helper.id);
          expect(aria).to.include(error.id);
        });
      });

      describe('aria-describedby', () => {
        it('should be empty when the field is valid', () => {
          expect(element.hasAttribute('aria-describedby')).to.be.false;
        });

        it('should be empty when the field is invalid', async () => {
          element.invalid = true;
          await nextFrame();
          expect(element.hasAttribute('aria-describedby')).to.be.false;
        });
      });
    });
  });

  describe('slotted label', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag}>
          <label slot="label">Label</label>
          <input slot="input">
        </${tag}>
      `);
      await nextRender();
      input = element.querySelector('[slot=input]');
      label = element.querySelector('[slot=label]');
    });

    it('should set aria-labelledby on the custom slotted label', () => {
      const aria = input.getAttribute('aria-labelledby');
      expect(aria).to.be.ok;
      expect(aria).to.equal(label.id);
    });
  });

  describe('aria-required', () => {
    describe('field', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
      });

      it('should not set aria-required attribute by default', () => {
        expect(element.hasAttribute('aria-required')).to.be.false;
      });

      it('should not set aria-required attribute on required property change', async () => {
        element.required = true;
        await nextFrame();
        expect(element.hasAttribute('aria-required')).to.be.false;
      });
    });

    describe('field initially required', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} required></${tag}>`);
        await nextRender();
      });

      it('should not set aria-required attribute', () => {
        expect(element.hasAttribute('aria-required')).to.be.false;
      });
    });

    describe('field group', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${groupTag}></${groupTag}>`);
        await nextRender();
      });

      it('should not set aria-required attribute by default', () => {
        expect(element.hasAttribute('aria-required')).to.be.false;
      });

      it('should toggle aria-required attribute on required property change', async () => {
        element.required = true;
        await nextFrame();
        expect(element.getAttribute('aria-required')).to.equal('true');

        element.required = false;
        await nextFrame();
        expect(element.hasAttribute('aria-required')).to.be.false;
      });
    });

    describe('field group initially required', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${groupTag} required></${groupTag}>`);
        await nextRender();
      });

      it('should set aria-required to true', () => {
        expect(element.getAttribute('aria-required')).to.equal('true');
      });
    });
  });

  describe('custom helper', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag} required></${tag}>`);
      await nextRender();
      label = element.querySelector('[slot=label]');
      error = element.querySelector('[slot=error-message]');
      input = element.querySelector('[slot=input]');
    });

    it('should handle custom id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      helper.textContent = 'Helper';
      element.appendChild(helper);
      await nextFrame();
      expect(input.getAttribute('aria-describedby')).to.include('helper-component');
    });

    it('should handle restored id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      helper.textContent = 'Helper';
      element.appendChild(helper);
      await nextFrame();
      helper.removeAttribute('id');
      expect(input.getAttribute('aria-describedby')).to.include(helper.id);
    });
  });
};

describe('FieldMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('FieldMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
