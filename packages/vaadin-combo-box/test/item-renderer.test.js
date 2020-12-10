import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('form field', () => {
  let comboBox;

  describe('without template', () => {
    let items;

    beforeEach(() => {
      comboBox = fixtureSync(`
        <vaadin-combo-box
          item-label-path="name"
          item-value-path="symbol">
        </vaadin-combo-box>
      `);
      items = ['foo', 'bar', 'baz'];
      comboBox.items = items;
    });

    afterEach(() => {
      comboBox.opened = false;
    });

    it('should use renderer when it is defined', () => {
      comboBox.renderer = (root, comboBox, model) => {
        const textNode = document.createTextNode(`${model.item} ${model.index}`);
        root.appendChild(textNode);
      };
      comboBox.opened = true;

      const item = comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
      expect(item.$.content.textContent.trim()).to.equal('foo 0');
    });

    it('renderer should receive root, comboBox and model', (done) => {
      let isDone = false;

      comboBox.renderer = (root, comboBox, model) => {
        expect(root.getAttribute('part')).to.equal('content');
        expect(items.indexOf(model.item)).to.not.equal(-1);
        expect(comboBox).to.eql(comboBox);

        if (!isDone) {
          isDone = true;
          done();
        }
      };

      comboBox.opened = true;
    });

    it('should throw an error and remove template when added after renderer', () => {
      comboBox.renderer = () => {};
      const template = document.createElement('template');
      expect(() => {
        comboBox.appendChild(template);
        comboBox._observer.flush();
      }).to.throw(Error);
      expect(comboBox._itemTemplate).to.be.not.ok;
    });

    it('should be possible to manually invoke renderer', () => {
      comboBox.renderer = sinon.spy();
      comboBox.opened = true;

      // Number of items rendered on opening
      const renderedCount = comboBox.renderer.callCount;
      comboBox.render();
      expect(comboBox.renderer.callCount).to.be.equal(renderedCount * 2);
    });

    it('should not throw if render() called before opening', () => {
      expect(() => comboBox.render()).not.to.throw(Error);
    });
  });

  describe('with template', () => {
    beforeEach(() => {
      comboBox = fixtureSync(`
        <vaadin-combo-box item-label-path="name" item-value-path="symbol">
          <template>
            <p>templatizer-content</p>
          </template>
        </vaadin-combo-box>
      `);

      comboBox.items = ['foo', 'bar', 'baz'];
      comboBox._observer.flush();
    });

    it('should throw an error and remove renderer when added after template', () => {
      expect(() => (comboBox.renderer = () => {})).to.throw(Error);
      expect(comboBox.renderer).to.be.not.ok;
    });
  });
});
