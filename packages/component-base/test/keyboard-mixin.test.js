import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { KeyboardMixin } from '../src/keyboard-mixin.js';

describe('keyboard-mixin', () => {
  let element, keyDownSpy, keyUpSpy;

  before(() => {
    keyDownSpy = sinon.spy();
    keyUpSpy = sinon.spy();

    customElements.define(
      'keyboard-mixin-element',
      class extends KeyboardMixin(PolymerElement) {
        static get template() {
          return html`<div></div>`;
        }

        _onKeyDown(event) {
          keyDownSpy(event);
        }

        _onKeyUp(event) {
          keyUpSpy(event);
        }
      },
    );
  });

  beforeEach(() => {
    // Sets tabindex to 0 in order to make the element focusable for the time of testing.
    element = fixtureSync(`<keyboard-mixin-element tabindex="0"></keyboard-mixin-element>`);
    element.focus();
  });

  afterEach(() => {
    keyDownSpy.resetHistory();
    keyUpSpy.resetHistory();
  });

  it('should handle keydown event', async () => {
    await sendKeys({ down: 'A' });

    expect(keyDownSpy.calledOnce).to.be.true;
    expect(keyDownSpy.args[0][0]).to.be.an.instanceOf(KeyboardEvent);
    expect(keyDownSpy.args[0][0].type).to.equal('keydown');
  });

  it('should handle keyup event', async () => {
    await sendKeys({ up: 'A' });

    expect(keyUpSpy.calledOnce).to.be.true;
    expect(keyUpSpy.args[0][0]).to.be.an.instanceOf(KeyboardEvent);
    expect(keyUpSpy.args[0][0].type).to.equal('keyup');
  });
});
