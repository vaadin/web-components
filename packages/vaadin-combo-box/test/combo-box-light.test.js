import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { resetMouseCanceller } from '@polymer/polymer/lib/utils/gestures.js';
import { downAndUp, pressAndReleaseKeyOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-input/iron-input.js';
import '@polymer/paper-input/paper-input.js';
import '@vaadin/vaadin-text-field/vaadin-text-field.js';
import { createEventSpy, fire, TOUCH_DEVICE } from './helpers.js';
import './not-animated-styles.js';
import '../vaadin-combo-box-light.js';

class MyInput extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <iron-input id="input" bind-value="{{customValue}}">
        <input />
      </iron-input>
    `;
  }

  static get properties() {
    return {
      customValue: {
        type: String,
        notify: true
      }
    };
  }
}

customElements.define('my-input', MyInput);

describe('vaadin-combo-box-light', () => {
  let comboBox, ironInput;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light attr-for-value="bind-value">
        <iron-input>
          <input>
        </iron-input>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
    ironInput = comboBox.querySelector('iron-input');
  });

  describe('using iron-input', () => {
    it('should find the input element correctly', () => {
      expect(comboBox.inputElement).to.eql(ironInput);
    });

    it('should bind the input value correctly when setting combo box value', () => {
      // Empty string by default.
      expect(comboBox._inputElementValue).to.eql('');
      expect(ironInput.value).to.eql('');

      comboBox.value = 'foo';
      expect(comboBox._inputElementValue).to.eql('foo');
      expect(ironInput.value).to.eql('foo');
    });
  });

  it('should prevent default on overlay down', () => {
    comboBox.open();
    comboBox.close();

    const e = new CustomEvent('mousedown', { bubbles: true });
    const spy = sinon.spy(e, 'preventDefault');
    comboBox.$.overlay.$.dropdown.$.overlay.dispatchEvent(e);
    expect(spy.called).to.be.true;
  });

  it('should not prevent default on input down', () => {
    const e = new CustomEvent('mousedown', { bubbles: true });
    const spy = sinon.spy(e, 'preventDefault');
    ironInput.dispatchEvent(e);
    expect(spy.called).to.be.false;
  });

  describe('toggling', () => {
    // NOTE(platosha): because we use emulate touch events in these
    // tests, we need to reset mouseCanceller in Gestures. Otherwise
    // it might interfere and cancel clicks in totally unrelated tests.
    afterEach(() => {
      resetMouseCanceller();
    });

    it('should toggle overlay on input click', () => {
      ironInput.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(comboBox.opened).to.be.true;
    });

    const isSafari = /Safari/i.test(navigator.userAgent);
    (isSafari ? it.skip : it)('should toggle on input click on touch devices', (done) => {
      downAndUp(
        ironInput,
        () => {
          expect(comboBox.opened).to.be.true;
          done();
        },
        { emulateTouch: true }
      );
    });

    it('should not clear on input click', () => {
      comboBox.value = 'foo';
      ironInput.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      expect(comboBox.value).to.equal('foo');
    });

    (isSafari ? it.skip : it)('should not clear on input click on touch devices', (done) => {
      comboBox.value = 'foo';
      downAndUp(
        ironInput,
        () => {
          expect(comboBox.value).to.equal('foo');
          done();
        },
        { emulateTouch: true }
      );
    });
  });

  (TOUCH_DEVICE ? describe.skip : describe)('after opening', () => {
    beforeEach(() => {
      comboBox.open();
    });

    it('should prevent default on overlay mousedown (vaadin-combo-box-light)', () => {
      const preventDefaultSpy = sinon.spy();
      comboBox.open();
      const event = createEventSpy('mousedown', preventDefaultSpy);
      comboBox.$.overlay.$.dropdown.$.overlay.dispatchEvent(event);
      expect(preventDefaultSpy.called).to.be.true;
    });
  });
});

describe('attr-for-value', () => {
  let comboBox, customInput, ironInput, nativeInput;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light attr-for-value="custom-value">
        <my-input class="input"></my-input>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
    customInput = comboBox.querySelector('.input');
    ironInput = customInput.$.input;
    nativeInput = ironInput.querySelector('input');
  });

  describe('using custom input with custom attr-for-value', () => {
    it('should find the input element correctly', () => {
      expect(comboBox.inputElement).to.eql(customInput);
    });

    it('should bind the input value correctly when setting combo box value', () => {
      // Empty string by default.
      expect(comboBox._inputElementValue).to.eql('');
      expect(customInput.customValue).to.eql('');

      comboBox.value = 'foo';
      expect(comboBox._inputElementValue).to.eql('foo');
      expect(customInput.customValue).to.eql('foo');
    });

    it('should bind the input value correctly when getting input', () => {
      // Empty string by default.
      expect(comboBox._inputElementValue).to.eql('');
      expect(customInput.customValue).to.eql('');
      expect(nativeInput.value).to.eql('');

      // Make sure the slotted <input> has been detected by <iron-input>
      // before trying to modify the value of the <input>.
      // Otherwise iron-input will throw an error (in `_onInput`) because
      // it tries to read `inputElement.value` but `inputElement` is still
      // undefined.
      ironInput._observer.flush();

      // Simulate typing an option with a keyboard and confirming it via Enter
      nativeInput.value = 'foo';
      fire('input', nativeInput);
      pressAndReleaseKeyOn(nativeInput, 13, null, 'Enter');

      expect(comboBox.value).to.eql('foo');
      expect(comboBox._inputElementValue).to.eql('foo');
      expect(customInput.customValue).to.eql('foo');
    });
  });
});

describe('paper-input', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light>
        <paper-input>
          <button slot="suffix" class="clear-button">Clear</button>
          <button slot="suffix" class="toggle-button">Toggle</button>
        </paper-input>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  it('should toggle overlay by clicking toggle element', () => {
    comboBox._toggleElement.dispatchEvent(new CustomEvent('click', { bubbles: true }));
    expect(comboBox.opened).to.be.true;

    comboBox._toggleElement.dispatchEvent(new CustomEvent('click', { bubbles: true }));
    expect(comboBox.opened).to.be.false;
  });

  it('should prevent default on toggle element down', () => {
    const e = new CustomEvent('click', { bubbles: true });
    const spy = sinon.spy(e, 'preventDefault');
    comboBox._toggleElement.dispatchEvent(e);
    expect(spy.called).to.be.true;
  });

  it('should validate the paper-input element on checkValidity', () => {
    const spy = sinon.spy(comboBox.inputElement, 'validate');

    comboBox.required = true;
    comboBox.value = 'foo';
    comboBox.checkValidity();

    expect(spy.called).to.be.true;
  });

  describe('custom clear-button', () => {
    let clearButton;

    /**
     * Get the most specific element at the given viewport coordinates.
     * Same as "document.elementFromPoint()" but recursively digging through
     * shadow roots.
     */
    function elementFromPointDeep(x, y, root = document) {
      const result = root.elementFromPoint(x, y);
      if (!result) {
        return null;
      }
      // Prevent infinite loop due to slotted elements with shadow roots
      if (result === root.host) {
        return result;
      }
      if (result.shadowRoot) {
        return elementFromPointDeep(x, y, result.shadowRoot);
      }
      return result;
    }

    /**
     * Simulate a click at the position of the given element.
     * This can be used for more accurate testing of what would happen
     * when a user tries to click on a specific element.
     *
     * This needs to be used when we need to consider the effect of
     * possibly overlapping elements or "pointer-events: none"
     */
    function clickAtPositionOf(elem) {
      // Scroll the element into view if it's not already
      elem.scrollIntoView();
      // Get the viewport relative position of the element
      const rect = elem.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      const x = Math.ceil(rect.left);
      const y = Math.ceil(rect.top);
      // Get the element which would be targeted, when the user
      // tries to click on this position
      let target = elementFromPointDeep(x, y, elem.ownerDocument);
      if (!target) {
        return;
      }

      // Check if the found element contains a slot (needed for other browsers than Chrome)
      const slot = target.querySelector('slot');
      if (slot && slot.assignedNodes({ flatten: true }).indexOf(elem) !== -1) {
        target = elem;
      }

      fire('click', target);
    }

    beforeEach(() => {
      clearButton = comboBox.querySelector('.clear-button');
      comboBox.value = 'foo';
    });

    it('should be clickable when overlay is open', () => {
      const clickSpy = sinon.spy();
      clearButton.addEventListener('click', clickSpy);

      comboBox.open();
      clickAtPositionOf(clearButton);

      expect(clickSpy.callCount).to.equal(1);
    });

    it('should fire `change` event on clear', () => {
      const changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);

      fire('click', clearButton);

      expect(changeSpy.callCount).to.equal(1);
    });

    it('should clear the selection when clicking on the clear button', () => {
      comboBox.open();

      fire('click', clearButton);

      expect(comboBox.value).to.eql('');
      expect(comboBox.$.overlay._selectedItem).to.be.null;
      expect(comboBox.selectedItem).to.be.null;
    });

    it('should not close the dropdown after clearing a selection', () => {
      comboBox.open();

      fire('click', clearButton);

      expect(comboBox.opened).to.eql(true);
    });

    it('should not open the dropdown after clearing a selection', () => {
      fire('click', clearButton);

      expect(comboBox.opened).to.eql(false);
    });

    it('should cancel click event to avoid input blur', () => {
      comboBox.open();

      const event = fire('click', clearButton);

      expect(event.defaultPrevented).to.eql(true);
    });
  });
});

describe('theme attribute', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light attr-for-value="bind-value" theme="foo">
        <iron-input>
          <input>
        </iron-input>
      </vaadin-combo-box-light>
    `);
  });

  it('should propagate theme attribute to overlay', () => {
    comboBox.open();
    comboBox.close();

    expect(comboBox.$.overlay.$.dropdown.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to item', () => {
    comboBox.items = ['bar', 'baz'];
    comboBox.open();
    const item = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
    expect(item.getAttribute('theme')).to.equal('foo');
  });
});

describe('nested template', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light>
        <vaadin-text-field>
          <div slot="prefix">
            <dom-repeat items="[1, 2]">
              <template>
                [[item]] foo
              </template>
            </dom-repeat>
          </div>
        </vaadin-text-field>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['bar', 'baz', 'qux'];
  });

  it('should not throw error on open', () => {
    expect(() => comboBox.open()).not.to.throw(Error);
  });

  it('should not use nested template as the item template', () => {
    comboBox.open();
    const firstItem = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
    expect(comboBox.querySelector('[slot="prefix"]').innerHTML).to.contain('1 foo');
    expect(firstItem.shadowRoot.querySelector('#content').innerHTML).to.equal('bar');
  });
});

describe('vaadin-text-field', () => {
  let comboBox, textField;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light>
        <vaadin-text-field></vaadin-text-field>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['bar', 'baz', 'qux'];
    textField = comboBox.inputElement;
  });

  describe('clear-button-visible', () => {
    let clearButton;

    beforeEach(() => {
      textField.clearButtonVisible = true;
      clearButton = textField.$.clearButton;
      comboBox.value = 'bar';
    });

    it('should immediately clear value when using clear button of vaadin-text-field', () => {
      fire('click', clearButton);
      expect(comboBox.value).not.to.be.ok;
    });

    it('should not close the dropdown after clearing a selection', () => {
      comboBox.open();

      fire('click', clearButton);

      expect(comboBox.opened).to.eql(true);
    });

    it('should not open the dropdown after clearing a selection', () => {
      fire('click', clearButton);

      expect(comboBox.opened).to.eql(false);
    });
  });
});
