import { expect } from '@esm-bundle/chai';
import { arrowDownKeyDown, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './not-animated-styles.js';
import './fixtures/mock-combo-box-template-wrapper.js';
import './fixtures/mock-combo-box-light-template-wrapper.js';
import { getFirstItem } from '@vaadin/combo-box/test/helpers.js';

describe('item template', () => {
  let wrapper, comboBox, firstItem;

  ['combo-box', 'combo-box-light'].forEach((name) => {
    describe(name, () => {
      beforeEach(async () => {
        wrapper = fixtureSync(`<mock-${name}-template-wrapper></mock-${name}-template-wrapper>`);
        comboBox = wrapper.$.comboBox;
        await nextRender();
        comboBox.items = ['foo', 'bar'];
        comboBox.open();
        firstItem = getFirstItem(comboBox);
      });

      it('should render items using template', () => {
        expect(firstItem.innerHTML).to.contain('item: foo');
      });

      it('should have index property', () => {
        expect(firstItem.innerHTML).to.contain('index: 0');
      });

      it('should have selected property', () => {
        expect(firstItem.innerHTML).to.contain('selected: false');
      });

      it('should update selected property', () => {
        comboBox.value = 'foo';
        expect(firstItem.innerHTML).to.contain('selected: true');
      });

      it('should have focused property', () => {
        expect(firstItem.innerHTML).to.contain('focused: false');
      });

      it('should update focused property', () => {
        arrowDownKeyDown(comboBox.inputElement); // Press arrow down key
        expect(firstItem.innerHTML).to.contain('focused: true');
      });

      it('should forward parent properties', () => {
        wrapper.parentProperty = 'qux';
        expect(firstItem.innerHTML).to.contain('parentProperty: qux');
      });

      it('should forward parent paths', () => {
        wrapper.parentProperty = { foo: '' };
        wrapper.set('parentProperty.foo', 'bar');
        expect(firstItem.innerHTML).to.contain('parentProperty.foo: bar');
      });

      it('should support computed bindings in parent scope', () => {
        expect(firstItem.innerHTML).to.contain('parentMethod: quux');
      });

      it('should support event handlers in parent scope', () => {
        const spy = sinon.spy(wrapper, 'parentEventHandler');
        firstItem.querySelector('button').click();
        expect(spy.calledOnce).to.be.true;
      });

      it('should have content part wrapping template', () => {
        const content = firstItem.shadowRoot.querySelector('[part="content"]');
        expect(firstItem.querySelector('button').assignedSlot.parentNode).to.equal(content);
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

  describe('nested template', () => {
    let comboBox;

    beforeEach(async () => {
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
      await nextRender();
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
});
