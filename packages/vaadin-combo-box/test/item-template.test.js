import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

class ComboBoxWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-combo-box id="combobox" items="[[items]]">
        <template>
          index: [[index]] item: [[item]] selected: [[selected]] focused: [[focused]] parentProperty: [[parentProperty]]
          parentProperty.foo: [[parentProperty.foo]] parentMethod: [[parentMethod()]]
          <button on-click="parentEventHandler"></button>
        </template>
      </vaadin-combo-box>
    `;
  }

  static get properties() {
    return {
      items: Array
    };
  }

  parentMethod() {
    return 'quux';
  }

  parentEventHandler() {
    // do nothing
  }
}

customElements.define('combo-box-wrapper', ComboBoxWrapper);

describe('item template', () => {
  let scope, combobox, firstItem;

  beforeEach(() => {
    scope = fixtureSync('<combo-box-wrapper></combo-box-wrapper>');
    combobox = scope.$.combobox;
    combobox.items = ['foo', 'bar'];
    combobox.open();

    flush();
    firstItem = combobox.$.overlay._selector.querySelector('vaadin-combo-box-item');
  });

  it('should render items using template', () => {
    expect(firstItem.shadowRoot.innerHTML).to.contain('item: foo');
  });

  it('should have index property', () => {
    expect(firstItem.shadowRoot.innerHTML).to.contain('index: 0');
  });

  it('should have selected property', () => {
    expect(firstItem.shadowRoot.innerHTML).to.contain('selected: false');
  });

  it('should update selected property', () => {
    combobox.value = 'foo';
    expect(firstItem.shadowRoot.innerHTML).to.contain('selected: true');
  });

  it('should have focused property', () => {
    expect(firstItem.shadowRoot.innerHTML).to.contain('focused: false');
  });

  it('should update focused property', () => {
    keyDownOn(combobox.inputElement, 40); // Press arrow down key
    expect(firstItem.shadowRoot.innerHTML).to.contain('focused: true');
  });

  it('should forward parent properties', () => {
    scope.parentProperty = 'qux';
    expect(firstItem.shadowRoot.innerHTML).to.contain('parentProperty: qux');
  });

  it('should forward parent paths', () => {
    scope.parentProperty = { foo: '' };
    scope.set('parentProperty.foo', 'bar');
    expect(firstItem.shadowRoot.innerHTML).to.contain('parentProperty.foo: bar');
  });

  it('should support computed bindings in parent scope', () => {
    expect(firstItem.shadowRoot.innerHTML).to.contain('parentMethod: quux');
  });

  it('should support event handlers in parent scope', () => {
    const spy = sinon.spy(scope, 'parentEventHandler');
    firstItem.shadowRoot.querySelector('button').click();
    expect(spy.calledOnce).to.be.true;
  });

  it('should have content part wrapping template', () => {
    const content = firstItem.shadowRoot.querySelector('[part="content"]');
    expect(content.querySelector('button').parentElement).to.equal(content);
  });

  it('should have block style for the content part', () => {
    const content = firstItem.shadowRoot.querySelector('[part="content"]');
    expect(getComputedStyle(content).display).to.equal('block');
  });

  it('should preserve and propagate dir to the items', () => {
    combobox.close();
    combobox.setAttribute('dir', 'ltr');
    combobox.open();
    expect(firstItem.getAttribute('dir')).to.eql('ltr');
  });
});
