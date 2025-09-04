import { expect } from '@vaadin/chai-plugins';
import { defineLit, fixtureSync, focusin, focusout, keyDownOn, mousedown } from '@vaadin/testing-helpers';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { FocusMixin } from '../src/focus-mixin.js';

describe('FocusMixin', () => {
  const tag = defineLit(
    'focus-mixin',
    '<slot></slot>',
    (Base) =>
      class extends FocusMixin(PolylitMixin(Base)) {
        ready() {
          super.ready();
          const input = document.createElement('input');
          this.appendChild(input);
        }
      },
  );

  let element, input;

  beforeEach(() => {
    element = fixtureSync(`<${tag}></${tag}>`);
    input = element.querySelector('input');
  });

  it('should set focused attribute on focusin event', () => {
    focusin(input);
    expect(element.hasAttribute('focused')).to.be.true;
  });

  it('should remove focused attribute on focusout event', () => {
    focusin(input);
    focusout(input);
    expect(element.hasAttribute('focused')).to.be.false;
  });

  it('should set the focus-ring attribute on focusin after keydown', () => {
    keyDownOn(document.body, 9);
    focusin(input);
    expect(element.hasAttribute('focus-ring')).to.be.true;

    focusout(input);
    expect(element.hasAttribute('focus-ring')).to.be.false;
  });

  it('should remove focused attribute when disconnected from the DOM', () => {
    focusin(input);
    element.parentNode.removeChild(element);
    expect(element.hasAttribute('focused')).to.be.false;
  });

  it('should not set the focus-ring attribute on mousedown after keydown', () => {
    keyDownOn(document.body, 9);
    mousedown(input);
    focusin(input);
    expect(element.hasAttribute('focus-ring')).to.be.false;
  });

  it('should set focus-ring attribute when calling focus() by default', () => {
    element.focus();
    expect(element.hasAttribute('focus-ring')).to.be.true;
  });

  it('should not set focus-ring attribute when calling focus() with focusVisible: false', () => {
    element.focus({ focusVisible: false });
    expect(element.hasAttribute('focus-ring')).to.be.false;
  });
});
