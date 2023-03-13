import { expect } from '@esm-bundle/chai';
import { defineLit, definePolymer, fire, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { InputController } from '../src/input-controller.js';
import { PatternMixin } from '../src/pattern-mixin.js';
import { TextAreaController } from '../src/text-area-controller.js';

const runTests = (defineHelper, baseMixin) => {
  const tag = defineHelper(
    'pattern-mixin',
    '<slot name="input"></slot>',
    (Base) =>
      class extends PatternMixin(baseMixin(Base)) {
        ready() {
          super.ready();

          this.addController(
            new InputController(this, (input) => {
              this._setInputElement(input);
              this.stateTarget = input;
            }),
          );
        }
      },
  );

  const textareaTag = defineHelper(
    'pattern-mixin-textarea',
    '<slot name="textarea"></slot>',
    (Base) =>
      class extends PatternMixin(baseMixin(Base)) {
        ready() {
          super.ready();

          this.addController(
            new TextAreaController(this, (textarea) => {
              this._setInputElement(textarea);
              this.stateTarget = textarea;
            }),
          );
        }
      },
  );

  let element, input;

  function commitInputValue(value) {
    input.value = value;
    fire(input, 'input');
    fire(input, 'change');
  }

  describe('pattern', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${tag}></${tag}>`);
      await nextRender();
      input = element.querySelector('[slot=input]');
    });

    it('should propagate pattern property to the input', async () => {
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(input.pattern).to.equal('[-+\\d]');
    });

    it('should not validate the field when pattern is set', async () => {
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    it('should validate the field when invalid after pattern is changed', async () => {
      element.invalid = true;
      await nextFrame();
      const spy = sinon.spy(element, 'validate');
      element.pattern = '[-+\\d]';
      await nextFrame();
      expect(spy.calledOnce).to.be.true;
    });

    it('should update invalid state when pattern is removed', async () => {
      input.value = '123foo';
      element.pattern = '\\d+';
      await nextFrame();

      element.validate();
      expect(element.invalid).to.be.true;

      element.pattern = '';
      await nextFrame();
      expect(element.invalid).to.be.false;
    });

    // https://github.com/web-platform-tests/wpt/blob/7b0ebaccc62b566a1965396e5be7bb2bc06f841f/html/semantics/forms/constraints/form-validation-validity-patternMismatch.html
    it('should pass validation when pattern property is not set', async () => {
      element.pattern = null;
      await nextFrame();
      commitInputValue('abc');
      expect(element.checkValidity()).to.be.true;
    });

    it('should pass validation when value property is empty', async () => {
      element.pattern = '[A-Z]+';
      await nextFrame();
      commitInputValue('');
      expect(element.checkValidity()).to.be.true;
    });

    it('should pass validation when value property matches the pattern', async () => {
      element.pattern = '[A-Z]{1}';
      await nextFrame();
      commitInputValue('A');
      expect(element.checkValidity()).to.be.true;
    });

    it('should pass validation when unicode value property matches the pattern', async () => {
      element.pattern = '[A-Z]+';
      await nextFrame();
      commitInputValue('\u0041\u0042\u0043');
      expect(element.checkValidity()).to.be.true;
    });

    it('should fail validation when value property mismatches the pattern', async () => {
      element.pattern = '[a-z]{3,}';
      await nextFrame();
      commitInputValue('ABCD');
      expect(element.checkValidity()).to.be.false;
    });

    it('should fail validation when value property mismatches the pattern, even if a subset matches', async () => {
      element.pattern = '[A-Z]+';
      await nextFrame();
      commitInputValue('ABC123');
      expect(element.checkValidity()).to.be.false;
    });

    it('should pass validation when pattern contains invalid regular expression', async () => {
      element.pattern = '(abc';
      await nextFrame();
      commitInputValue('de');
      expect(element.checkValidity()).to.be.true;
    });

    it('should pass validation when pattern tries to escape a group', async () => {
      element.pattern = 'a)(b';
      await nextFrame();
      commitInputValue('de');
      expect(element.checkValidity()).to.be.true;
    });

    it('should pass validation when pattern uses Unicode features', async () => {
      element.pattern = 'a\u{10FFFF}';
      await nextFrame();
      commitInputValue('a\u{10FFFF}');
      expect(element.checkValidity()).to.be.true;
    });

    it('should pass validation when value matches JavaScript-specific regular expression', async () => {
      element.pattern = '\\u1234\\cx[5-[]{2}';
      await nextFrame();
      commitInputValue('\u1234\x18[6');
      expect(element.checkValidity()).to.be.true;
    });

    it('should fail validation when value mismatches JavaScript-specific regular expression', async () => {
      element.pattern = '\\u1234\\cx[5-[]{2}';
      await nextFrame();
      commitInputValue('\u1234\x18[4');
      expect(element.checkValidity()).to.be.false;
    });
  });

  describe('pattern + textarea', () => {
    beforeEach(async () => {
      element = fixtureSync(`<${textareaTag}></${textareaTag}>`);
      await nextRender();
      input = element.querySelector('[slot=textarea]');
    });

    it('should pass validation when value property matches the pattern (multiline)', async () => {
      element.pattern = '[A-Z\n]{3}';
      await nextFrame();
      commitInputValue('A\nJ');
      expect(element.checkValidity()).to.be.true;
    });
  });
};

describe('PatternMixin + Polymer', () => {
  runTests(definePolymer, ControllerMixin);
});

describe('PatternMixin + Lit', () => {
  runTests(defineLit, PolylitMixin);
});
