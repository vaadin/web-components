import { expect } from '@vaadin/chai-plugins';
import { aTimeout, definePolymer, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { FieldMixin } from '../src/field-mixin.js';
import { InputController } from '../src/input-controller.js';
import { InputMixin } from '../src/input-mixin.js';

describe('FieldMixin', () => {
  const tag = definePolymer(
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
      class extends FieldMixin(InputMixin(ControllerMixin(Base))) {
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

  const groupTag = definePolymer(
    'field-mixin-group',
    `
      <slot name="label"></slot>
      <slot name="error-message"></slot>
      <slot name="helper"></slot>
    `,
    (Base) =>
      class extends FieldMixin(ControllerMixin(Base)) {
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
        await nextUpdate(element);
        expect(error.textContent).to.equal('This field is required');
      });

      it('should update error message content on property change', async () => {
        element.errorMessage = 'This field is required';
        await nextUpdate(element);
        expect(error.textContent).to.equal('This field is required');
      });

      it('should clear error message content when field is valid', async () => {
        element.errorMessage = 'This field is required';
        await nextUpdate(element);

        element.invalid = false;
        await nextUpdate(element);
        expect(error.textContent).to.equal('');
      });

      it('should not set has-error-message attribute with no error', () => {
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should not set has-error-message attribute when the property is an empty string', async () => {
        element.errorMessage = '';
        await nextUpdate(element);
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should not set has-error-message attribute when the property is null', async () => {
        element.errorMessage = null;
        await nextUpdate(element);
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });

      it('should set has-error-message attribute when attribute is set', async () => {
        element.setAttribute('error-message', 'This field is required');
        await nextUpdate(element);
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should set has-error-message attribute when property is set', async () => {
        element.errorMessage = 'This field is required';
        await nextUpdate(element);
        expect(element.hasAttribute('has-error-message')).to.be.true;
      });

      it('should remove has-error-message attribute when field is valid', async () => {
        element.errorMessage = 'This field is required';
        await nextUpdate(element);

        element.invalid = false;
        await nextUpdate(element);
        expect(element.hasAttribute('has-error-message')).to.be.false;
      });
    });

    describe('announcements', () => {
      let announceRegion;

      beforeEach(async () => {
        element = fixtureSync(`<${tag}></${tag}>`);
        await nextRender();
        announceRegion = document.querySelector('[aria-live]');
        announceRegion.textContent = '';
      });

      it('should announce error message set via attribute when field is invalid', async () => {
        element.invalid = true;
        element.setAttribute('error-message', 'This field is required');
        await nextUpdate(element);
        await aTimeout(150);
        expect(announceRegion.textContent).to.equal('This field is required');
        expect(announceRegion.getAttribute('aria-live')).to.equal('assertive');
      });

      it('should announce error message set via property when field is invalid', async () => {
        element.invalid = true;
        element.errorMessage = 'This field is required';
        await nextUpdate(element);
        await aTimeout(150);
        expect(announceRegion.textContent).to.equal('This field is required');
        expect(announceRegion.getAttribute('aria-live')).to.equal('assertive');
      });

      it('should not announce error message when field is valid', async () => {
        element.errorMessage = 'This field is required';
        await nextUpdate(element);
        await aTimeout(150);
        expect(announceRegion.textContent).to.equal('');
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
        await nextUpdate(element);
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
        await nextUpdate(element);
        helper = element.querySelector('[slot=helper]');
        expect(helper).to.be.an.instanceof(HTMLDivElement);
      });

      it('should add a helper when helper-text attribute is set', async () => {
        element.setAttribute('helper-text', '3 digits');
        await nextUpdate(element);
        helper = element.querySelector('[slot=helper]');
        expect(helper).to.be.an.instanceof(HTMLDivElement);
      });

      it('should not set has-helper attribute with no helper', () => {
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should set has-helper attribute when attribute is set', async () => {
        element.setAttribute('helper-text', '3 digits');
        await nextUpdate(element);
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should set has-helper attribute when property is set', async () => {
        element.helperText = '3 digits';
        await nextUpdate(element);
        expect(element.hasAttribute('has-helper')).to.be.true;
      });

      it('should not add a helper when helperText is whitespace string', async () => {
        element.helperText = ' ';
        await nextUpdate(element);
        expect(element.querySelector('[slot=helper]')).to.be.not.ok;
      });

      it('should not set has-helper when helperText is whitespace string', async () => {
        element.helperText = ' ';
        await nextUpdate(element);
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should clear helper when helperText is set to empty string', async () => {
        element.helperText = '3 digits';
        await nextUpdate(element);
        helper = element.querySelector('[slot=helper]');

        element.helperText = '';
        await nextUpdate(element);
        expect(helper.textContent).to.equal('');
      });

      it('should remove has-helper attribute when helperText is cleared', async () => {
        element.helperText = '3 digits';
        await nextUpdate(element);
        helper = element.querySelector('[slot=helper]');

        element.helperText = '';
        await nextUpdate(element);
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
        await nextUpdate(element);
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should update helper content on property change', async () => {
        element.helperText = '3 digits';
        await nextUpdate(element);
        expect(helper.textContent).to.equal('3 digits');
      });

      it('should remove has-helper attribute when property is unset', async () => {
        element.helperText = '';
        await nextUpdate(element);
        expect(element.hasAttribute('has-helper')).to.be.false;
      });

      it('should remove has-helper attribute when property is null', async () => {
        element.helperText = null;
        await nextUpdate(element);
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
        await nextUpdate(element);
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
        await nextUpdate(element);
        expect(helper.textContent).to.not.equal('3 digits');
      });

      it('should remove has-helper attribute when slotted helper is removed', async () => {
        element.removeChild(helper);
        await nextUpdate(element);
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
        const helperTag = definePolymer('custom-helper', '<div>Helper</div>', (Base) => Base);
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
          await nextRender();
          expect(element._helperNode).to.equal(helper);
        });

        it('should handle lazy helper added using insertBefore', async () => {
          element.insertBefore(helper, defaultHelper);
          await nextRender();
          expect(element._helperNode).to.equal(helper);
        });

        it('should handle lazy helper added using replaceChild', async () => {
          element.replaceChild(helper, defaultHelper);
          await nextRender();
          expect(element._helperNode).to.equal(helper);
        });

        it('should remove the default helper from the element when using appendChild', async () => {
          element.appendChild(helper);
          await nextRender();
          expect(defaultHelper.parentNode).to.be.null;
        });

        it('should remove the default helper from the element when using insertBefore', async () => {
          element.insertBefore(helper, defaultHelper);
          await nextRender();
          expect(defaultHelper.parentNode).to.be.null;
        });

        it('should support replacing lazy helper with a new one using appendChild', async () => {
          element.appendChild(helper);
          await nextRender();

          const div = document.createElement('div');
          div.setAttribute('slot', 'helper');
          div.textContent = 'New';
          element.appendChild(div);
          await nextRender();
          expect(element._helperNode).to.equal(div);
        });

        it('should support replacing lazy helper with a new one using insertBefore', async () => {
          element.appendChild(helper);
          await nextRender();

          const div = document.createElement('div');
          div.setAttribute('slot', 'helper');
          div.textContent = 'New';
          element.insertBefore(div, helper);
          await nextRender();
          expect(element._helperNode).to.equal(div);
        });

        it('should support replacing lazy helper with a new one using replaceChild', async () => {
          element.appendChild(helper);
          await nextRender();

          const div = document.createElement('div');
          div.setAttribute('slot', 'helper');
          div.textContent = 'New';
          element.replaceChild(div, helper);
          await nextRender();
          expect(element._helperNode).to.equal(div);
        });

        it('should support adding lazy helper after removing the default one', async () => {
          element.removeChild(defaultHelper);
          await nextRender();

          element.appendChild(helper);
          await nextRender();

          expect(element._helperNode).to.equal(helper);
        });

        it('should restore the default helper when helperText property is set', async () => {
          element.appendChild(helper);
          await nextRender();

          element.removeChild(helper);
          await nextRender();
          expect(element._helperNode).to.equal(defaultHelper);
        });

        it('should restore the default helper when helperText property is restored', async () => {
          element.appendChild(helper);
          await nextRender();

          element.helperText = '';

          element.removeChild(helper);
          await nextRender();

          element.helperText = 'Helper';
          await nextRender();
          expect(element._helperNode).to.equal(defaultHelper);
        });

        it('should restore the default helper when restoring helperText immediately', async () => {
          element.helperText = null;
          element.appendChild(helper);
          await nextRender();

          element.removeChild(helper);
          element.helperText = 'Updated helper';
          await nextRender();
          expect(element._helperNode.textContent).to.equal('Updated helper');
        });

        it('should keep has-helper attribute when the default helper is restored', async () => {
          element.appendChild(helper);
          await nextRender();

          element.removeChild(helper);
          await nextRender();
          expect(element.hasAttribute('has-helper')).to.be.true;
        });

        it('should remove has-helper attribute when helperText is set to empty', async () => {
          element.appendChild(helper);
          await nextRender();

          element.helperText = '';

          element.removeChild(helper);
          await nextRender();
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
          await nextRender();
          expect(helper.getAttribute('id')).to.match(ID_REGEX);
        });

        it('should not override custom id on the lazily added helper', async () => {
          helper.id = 'helper-component';
          element.appendChild(helper);
          await nextRender();
          expect(helper.getAttribute('id')).to.equal('helper-component');
        });

        it('should restore default id if the custom helper id is removed', async () => {
          helper.id = 'helper-component';
          element.appendChild(helper);
          await nextRender();
          helper.removeAttribute('id');
          await nextRender();
          expect(helper.getAttribute('id')).to.match(ID_REGEX);
        });

        it('should apply helper text if the custom helper is removed', async () => {
          element.appendChild(helper);
          await nextRender();
          element.helperText = 'Default';
          element.removeChild(helper);
          await nextRender();
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
          await nextRender();
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
          await nextUpdate(element);
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
          await nextUpdate(element);
          await aTimeout(0);
          const aria = input.getAttribute('aria-describedby');
          expect(aria).to.include(helper.id);
          expect(aria).to.include(error.id);
          expect(aria).to.not.include(label.id);
        });
      });
    });

    describe('accessible-name', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} label="Label"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should not define aria-label if no accessible-name is defined', () => {
        expect(input.hasAttribute('aria-label')).to.be.false;
      });

      it('should not change aria-labelledby if no accessible-name is defined', () => {
        expect(input.hasAttribute('aria-labelledby')).to.be.true;
      });

      it('should set aria-label when accessible-name is defined', async () => {
        element.accessibleName = 'accessible name';
        await nextUpdate(element);
        expect(input.getAttribute('aria-label')).to.be.equal('accessible name');
      });

      it('should remove aria-labelledby by if no accessible name is defined', async () => {
        element.accessibleName = 'accessible name';
        await nextUpdate(element);
        expect(input.hasAttribute('aria-labelledby')).to.be.false;
      });

      it('should remove aria-label when accessible name is cleared', async () => {
        element.accessibleName = 'accessible name';
        await nextUpdate(element);
        element.accessibleName = null;
        await nextUpdate(element);
        expect(input.hasAttribute('aria-label')).to.be.false;
      });

      it('should restore aria-labelledby value if accessible-name is cleared', async () => {
        const ariaLabelledby = input.getAttribute('aria-labelledby');
        element.accessibleName = 'accessible name';
        await nextUpdate(element);
        element.accessibleName = null;
        await nextUpdate(element);
        expect(input.getAttribute('aria-labelledby')).to.be.equal(ariaLabelledby);
      });
    });

    describe('accessible-name is set initially', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} label="Label" accessible-name="accessible-name"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should have accessibleName value in aria-label', () => {
        expect(input.getAttribute('aria-label')).to.equal('accessible-name');
      });

      it('input should have aria-labellebdy by empty', () => {
        expect(input.getAttribute('aria-labelledby')).to.be.null;
      });

      it('should set default label to `aria-labellebdy` when accessible-name is removed', async () => {
        const label = element.querySelector('[slot=label]');
        element.accessibleName = null;
        await nextRender();
        expect(input.getAttribute('aria-labelledby')).to.equal(label.id);
      });
    });

    describe('accessible-name-ref', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} label="Label"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should not override aria-labelledby if no accessible-name-ref is defined', () => {
        expect(input.hasAttribute('aria-labelledby')).to.be.true;
      });

      it('should set aria-labelledby when accessible-name-ref is defined', async () => {
        element.accessibleNameRef = 'accessible-name-ref-0';
        await nextUpdate(element);
        expect(input.getAttribute('aria-labelledby')).to.be.equal('accessible-name-ref-0');
      });

      it('should change aria-labelledby if accessible-name-ref is changed', async () => {
        element.accessibleNameRef = 'accessible-name-ref-0';
        await nextUpdate(element);
        element.accessibleNameRef = 'accessible-name-ref-1';
        await nextUpdate(element);
        expect(input.getAttribute('aria-labelledby')).to.be.equal('accessible-name-ref-1');
      });

      it('should restore aria-labelledby by if accessible-name-ref is cleared', async () => {
        const previousAriaLabelledBy = input.getAttribute('aria-labelledby');
        expect(previousAriaLabelledBy).to.not.be.empty;
        element.accessibleNameRef = 'accessible-name-ref-0';
        await nextUpdate(element);
        element.accessibleNameRef = null;
        await nextUpdate(element);
        expect(input.getAttribute('aria-labelledby')).to.be.equal(previousAriaLabelledBy);
      });

      it('should not remove aria-labelledby if accessible-name-ref is defined and label is cleared', async () => {
        element.accessibleNameRef = 'accessible-name-ref-0';
        await nextUpdate(element);
        element.label = null;
        await nextUpdate(element);
        expect(input.getAttribute('aria-labelledby')).to.be.equal('accessible-name-ref-0');
      });

      it('should not change aria-labelledby if accessible-name-ref is defined and label is changed', async () => {
        element.accessibleNameRef = 'accessible-name-ref-0';
        await nextUpdate(element);
        element.label = 'Another label';
        await nextUpdate(element);
        expect(input.getAttribute('aria-labelledby')).to.be.equal('accessible-name-ref-0');
      });
    });

    describe('accessible-name-ref is set initially', () => {
      beforeEach(async () => {
        element = fixtureSync(`<${tag} label="Label" accessible-name-ref="accessible-name-ref-0"></${tag}>`);
        await nextRender();
        input = element.querySelector('[slot=input]');
      });

      it('should contain accessibleNameRef in aria-labelledby', () => {
        expect(input.getAttribute('aria-labelledby')).to.be.equal('accessible-name-ref-0');
      });

      it('should set default label to `aria-labellebdy` when accessible-name-ref is removed', async () => {
        const label = element.querySelector('[slot=label]');
        element.accessibleNameRef = null;
        await nextRender();
        expect(input.getAttribute('aria-labelledby')).to.equal(label.id);
      });
    });
  });

  describe('slotted label', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <${tag} label="Default">
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

    it('should restore aria-labelledby when removing slotted label', async () => {
      label.remove();
      await nextRender();
      const defaultLabel = element.querySelector('[slot=label]');
      const aria = input.getAttribute('aria-labelledby');
      expect(aria).to.be.ok;
      expect(aria).to.equal(defaultLabel.id);
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
        await nextUpdate(element);
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
        await nextUpdate(element);
        expect(element.getAttribute('aria-required')).to.equal('true');

        element.required = false;
        await nextUpdate(element);
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
      await nextRender();
      expect(input.getAttribute('aria-describedby')).to.include('helper-component');
    });

    it('should handle restored id of a lazily added helper', async () => {
      helper = document.createElement('div');
      helper.setAttribute('slot', 'helper');
      helper.id = 'helper-component';
      helper.textContent = 'Helper';
      element.appendChild(helper);
      await nextRender();
      helper.removeAttribute('id');
      expect(input.getAttribute('aria-describedby')).to.include(helper.id);
    });
  });
});
