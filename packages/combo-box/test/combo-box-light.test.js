import { expect } from '@esm-bundle/chai';
import {
  click,
  fire,
  fixtureSync,
  isDesktopSafari,
  isIOS,
  mousedown,
  mouseup,
  nextFrame,
  touchend,
  touchstart,
} from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '@vaadin/text-field/vaadin-text-field.js';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './not-animated-styles.js';
import '../vaadin-combo-box-light.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { getFirstItem } from './helpers.js';

class MyInput extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <vaadin-text-field id="input" value="{{customValue}}"></vaadin-text-field>
    `;
  }

  static get properties() {
    return {
      customValue: {
        type: String,
        notify: true,
      },
    };
  }
}

customElements.define('my-input', MyInput);

describe('vaadin-combo-box-light', () => {
  let comboBox, overlay, inputElement;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light>
        <vaadin-text-field></vaadin-text-field>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
    overlay = comboBox.$.overlay;
    inputElement = comboBox.querySelector('vaadin-text-field');
  });

  it('should find the input element correctly', () => {
    expect(comboBox.inputElement).to.eql(inputElement);
  });

  it('should update input element value when setting combo box value', () => {
    // Empty string by default.
    expect(inputElement.value).to.eql('');

    comboBox.value = 'foo';
    expect(inputElement.value).to.eql('foo');
  });

  it('should prevent default on overlay down', () => {
    const e = new CustomEvent('mousedown', { bubbles: true });
    const spy = sinon.spy(e, 'preventDefault');
    overlay.dispatchEvent(e);
    expect(spy.calledOnce).to.be.true;
  });

  it('should not prevent default on input down', () => {
    const e = new CustomEvent('mousedown', { bubbles: true });
    const spy = sinon.spy(e, 'preventDefault');
    inputElement.dispatchEvent(e);
    expect(spy.calledOnce).to.be.false;
  });

  describe('toggling', () => {
    it('should toggle overlay on input click', () => {
      inputElement.click();
      expect(comboBox.opened).to.be.true;
    });

    (isDesktopSafari ? it.skip : it)('should toggle on input click on touch devices', () => {
      touchstart(inputElement);
      touchend(inputElement);
      mousedown(inputElement);
      mouseup(inputElement);
      click(inputElement);

      expect(comboBox.opened).to.be.true;
    });

    it('should not clear on input click', () => {
      comboBox.value = 'foo';
      inputElement.click();
      expect(comboBox.value).to.equal('foo');
    });

    (isDesktopSafari ? it.skip : it)('should not clear on input click on touch devices', () => {
      comboBox.value = 'foo';

      touchstart(inputElement);
      touchend(inputElement);
      mousedown(inputElement);
      mouseup(inputElement);
      click(inputElement);

      expect(comboBox.value).to.equal('foo');
    });
  });

  (isIOS ? describe.skip : describe)('after opening', () => {
    beforeEach(() => {
      comboBox.open();
    });

    it('should prevent default on overlay mousedown (vaadin-combo-box-light)', () => {
      comboBox.open();
      const event = fire(overlay, 'mousedown');
      expect(event.defaultPrevented).to.be.true;
    });
  });

  describe('clear-button-visible', () => {
    let clearButton;

    beforeEach(() => {
      inputElement.clearButtonVisible = true;
      clearButton = inputElement.$.clearButton;
      comboBox.value = 'bar';
    });

    it('should immediately clear value when using clear button of vaadin-text-field', () => {
      click(clearButton);
      expect(comboBox.value).not.to.be.ok;
    });

    it('should not close the dropdown after clearing a selection', () => {
      comboBox.open();

      click(clearButton);

      expect(comboBox.opened).to.be.true;
    });

    it('should not open the dropdown after clearing a selection', () => {
      click(clearButton);

      expect(comboBox.opened).to.be.false;
    });
  });
});

describe('attr-for-value', () => {
  let comboBox, customInput, inputElement;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light attr-for-value="custom-value">
        <my-input class="input"></my-input>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
    customInput = comboBox.querySelector('.input');
    inputElement = customInput.$.input;
  });

  describe('using custom input with custom attr-for-value', () => {
    it('should find the input element correctly', () => {
      expect(comboBox.inputElement).to.eql(customInput);
    });

    it('should bind the input value correctly when setting combo box value', () => {
      // Empty string by default.
      expect(customInput.customValue).to.eql('');

      comboBox.value = 'foo';
      expect(customInput.customValue).to.eql('foo');
    });

    it('should bind the input value correctly when getting input', async () => {
      // Empty string by default.
      expect(customInput.customValue).to.eql('');
      expect(inputElement.value).to.eql('');

      // Simulate typing an option with a keyboard and confirming it via Enter
      inputElement.focus();
      await sendKeys({ type: 'foo' });
      await sendKeys({ press: 'Enter' });

      expect(comboBox.value).to.eql('foo');
      expect(customInput.customValue).to.eql('foo');
    });
  });
});

describe('custom buttons', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light>
        <vaadin-text-field>
          <button slot="suffix" class="clear-button">Clear</button>
          <button slot="suffix" class="toggle-button">Toggle</button>
        </vaadin-text-field>
      </vaadin-combo-box-light>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  describe('toggle-button', () => {
    let toggleButton;

    beforeEach(() => {
      toggleButton = comboBox.querySelector('.toggle-button');
    });

    it('should toggle overlay by clicking toggle element', () => {
      click(toggleButton);
      expect(comboBox.opened).to.be.true;

      click(toggleButton);
      expect(comboBox.opened).to.be.false;
    });

    it('should prevent default on toggle element down', () => {
      const e = new CustomEvent('mousedown', { bubbles: true });
      const spy = sinon.spy(e, 'preventDefault');
      toggleButton.dispatchEvent(e);
      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('clear-button', () => {
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
      const target = elementFromPointDeep(x, y, elem.ownerDocument);
      if (!target) {
        return;
      }

      click(target);
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

      expect(clickSpy.calledOnce).to.be.true;
    });

    it('should fire `change` event on clear', () => {
      const changeSpy = sinon.spy();
      comboBox.addEventListener('change', changeSpy);

      click(clearButton);

      expect(changeSpy.calledOnce).to.be.true;
    });

    it('should clear the selection when clicking on the clear button', () => {
      comboBox.open();

      click(clearButton);

      expect(comboBox.value).to.eql('');
      expect(comboBox._scroller.selectedItem).to.be.null;
      expect(comboBox.selectedItem).to.be.null;
    });

    it('should not close the dropdown after clearing a selection', () => {
      comboBox.open();

      click(clearButton);

      expect(comboBox.opened).to.be.true;
    });

    it('should not open the dropdown after clearing a selection', () => {
      click(clearButton);

      expect(comboBox.opened).to.be.false;
    });

    it('should prevent mousedown event to avoid input blur', () => {
      comboBox.open();

      const event = new CustomEvent('mousedown', { cancelable: true });
      clearButton.dispatchEvent(event);

      expect(event.defaultPrevented).to.be.true;
    });
  });
});

describe('theme attribute', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box-light theme="foo">
        <vaadin-text-field></vaadin-text-field>
      </vaadin-combo-box-light>
    `);
  });

  it('should propagate theme attribute to overlay', () => {
    expect(comboBox.$.overlay.getAttribute('theme')).to.equal('foo');
  });

  it('should propagate theme attribute to item', () => {
    comboBox.items = ['bar', 'baz'];
    comboBox.open();
    expect(getFirstItem(comboBox).getAttribute('theme')).to.equal('foo');
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

  it('should not use nested template as the item template', async () => {
    comboBox.open();
    await nextFrame();
    expect(comboBox.querySelector('[slot="prefix"]').innerHTML).to.contain('1 foo');
    expect(getFirstItem(comboBox).innerHTML).to.equal('bar');
  });
});
