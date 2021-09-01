import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { sendKeys } from '@web/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { KeyboardMixin } from '../src/keyboard-mixin.js';

customElements.define(
  'keyboard-mixin-element',
  class extends KeyboardMixin(PolymerElement) {
    static get template() {
      return html`<div></div>`;
    }
  }
);

describe('keyboard-mixin', () => {
  let element;

  beforeEach(() => {
    // Sets tabindex to 0 in order to make the element focusable for the time of testing.
    element = fixtureSync(`<keyboard-mixin-element tabindex="0"></keyboard-mixin-element>`);
    element._onKeyDown = sinon.spy();
    element._onKeyUp = sinon.spy();
    element.focus();
  });

  it('should handle keydown event', async () => {
    await sendKeys({ down: 'A' });

    expect(element._onKeyDown.calledOnce).to.be.true;
    expect(element._onKeyDown.args[0][0]).to.be.an.instanceOf(KeyboardEvent);
    expect(element._onKeyDown.args[0][0].type).to.equal('keydown');
  });

  it('should handle keyup event', async () => {
    await sendKeys({ up: 'A' });

    expect(element._onKeyUp.calledOnce).to.be.true;
    expect(element._onKeyUp.args[0][0]).to.be.an.instanceOf(KeyboardEvent);
    expect(element._onKeyUp.args[0][0].type).to.equal('keyup');
  });
});
