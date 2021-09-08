import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, keyDownOn } from '@vaadin/testing-helpers';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import '@vaadin/vaadin-template-renderer';
import './not-animated-styles.js';
import { getFirstItem } from './helpers.js';
import './fixtures/mock-combo-box-template-wrapper.js';
import './fixtures/mock-combo-box-light-template-wrapper.js';

describe('item template', () => {
  let wrapper, comboBox, firstItem;

  ['combo-box', 'combo-box-light'].forEach((name) => {
    describe(name, () => {
      beforeEach(() => {
        wrapper = fixtureSync(`<mock-${name}-template-wrapper></mock-${name}-template-wrapper>`);
        comboBox = wrapper.$.comboBox;
        comboBox.items = ['foo', 'bar'];
        comboBox.open();

        flush();
        firstItem = getFirstItem(comboBox);
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
        comboBox.value = 'foo';
        expect(firstItem.shadowRoot.innerHTML).to.contain('selected: true');
      });

      it('should have focused property', () => {
        expect(firstItem.shadowRoot.innerHTML).to.contain('focused: false');
      });

      it('should update focused property', () => {
        keyDownOn(comboBox.inputElement, 40); // Press arrow down key
        expect(firstItem.shadowRoot.innerHTML).to.contain('focused: true');
      });

      it('should forward parent properties', () => {
        wrapper.parentProperty = 'qux';
        expect(firstItem.shadowRoot.innerHTML).to.contain('parentProperty: qux');
      });

      it('should forward parent paths', () => {
        wrapper.parentProperty = { foo: '' };
        wrapper.set('parentProperty.foo', 'bar');
        expect(firstItem.shadowRoot.innerHTML).to.contain('parentProperty.foo: bar');
      });

      it('should support computed bindings in parent scope', () => {
        expect(firstItem.shadowRoot.innerHTML).to.contain('parentMethod: quux');
      });

      it('should support event handlers in parent scope', () => {
        const spy = sinon.spy(wrapper, 'parentEventHandler');
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
        comboBox.close();
        comboBox.setAttribute('dir', 'ltr');
        comboBox.open();
        expect(firstItem.getAttribute('dir')).to.eql('ltr');
      });
    });
  });
});
