import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';
import { getFirstItem } from './helpers.js';

describe('item renderer', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`
      <vaadin-combo-box
        item-label-path="name"
        item-value-path="symbol">
      </vaadin-combo-box>
    `);
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  afterEach(() => {
    comboBox.opened = false;
  });

  describe('arguments', () => {
    beforeEach(() => {
      comboBox.renderer = sinon.spy();
      comboBox.opened = true;
    });

    it(`should pass the 'root', 'owner', 'model' arguments to the renderer`, () => {
      const [root, owner, model] = comboBox.renderer.args[0];

      expect(root.localName).to.equal('vaadin-combo-box-item');
      expect(owner).to.eql(comboBox);
      expect(model).to.deep.equal({
        item: 'foo',
        index: 0,
        focused: false,
        selected: false,
      });
    });

    it(`should change the 'model.selected' property`, () => {
      comboBox.value = 'foo';

      const model = comboBox.renderer.lastCall.args[2];

      expect(model.selected).to.be.true;
    });

    it(`should change the 'model.focused' property`, () => {
      comboBox._focusedIndex = 0;

      const model = comboBox.renderer.lastCall.args[2];

      expect(model.focused).to.be.true;
    });
  });

  it('should use renderer when it is defined', () => {
    comboBox.renderer = (root, comboBox, model) => {
      const textNode = document.createTextNode(`${model.item} ${model.index}`);
      root.appendChild(textNode);
    };
    comboBox.opened = true;

    expect(getFirstItem(comboBox).textContent.trim()).to.equal('foo 0');
  });

  it('should run renderers when requesting content update', () => {
    comboBox.renderer = sinon.spy();
    comboBox.opened = true;

    expect(comboBox.renderer.callCount).to.be.equal(comboBox.items.length);

    comboBox.requestContentUpdate();

    expect(comboBox.renderer.callCount).to.be.equal(comboBox.items.length * 2);
  });

  it('should not throw if requestContentUpdate() called before opening', () => {
    expect(() => comboBox.requestContentUpdate()).not.to.throw(Error);
  });

  it('should render the item label when removing the renderer', () => {
    comboBox.renderer = (root) => {
      root.textContent = 'bar';
    };
    comboBox.opened = true;

    expect(getFirstItem(comboBox).textContent).to.equal('bar');

    comboBox.renderer = null;

    expect(getFirstItem(comboBox).textContent).to.equal('foo');
  });

  it('should clear the old content after assigning a new renderer', () => {
    comboBox.opened = true;
    comboBox.renderer = () => {};
    expect(getFirstItem(comboBox).textContent).to.equal('');
  });
});
