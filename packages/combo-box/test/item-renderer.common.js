import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import { getAllItems, getFirstItem, setInputValue } from './helpers.js';

describe('item renderer', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
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
    comboBox.renderer = (root, _comboBox, model) => {
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

  it('should restore filtered item content', () => {
    const contentNodes = comboBox.items.map((item) => document.createTextNode(item));

    comboBox.renderer = (root, _, { item }) => {
      root.textContent = '';
      root.append(contentNodes[comboBox.items.indexOf(item)]);
    };

    comboBox.opened = true;
    setInputValue(comboBox, 'r');
    setInputValue(comboBox, '');
    expect(getAllItems(comboBox)[1].textContent).to.equal('bar');
  });
});
