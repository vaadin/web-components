import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-template-renderer';
import './not-animated-styles.js';
import '../vaadin-combo-box.js';

describe('item renderer', () => {
  let comboBox;

  let items;

  function getFirstItem() {
    return comboBox.$.overlay._selector.querySelector('vaadin-combo-box-item');
  }

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

    expect(getFirstItem().$.content.textContent.trim()).to.equal('foo 0');
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

  it('should render the item label when removing the renderer', () => {
    comboBox.renderer = (root) => {
      root.textContent = 'bar';
    };
    comboBox.opened = true;

    expect(getFirstItem().$.content.textContent).to.equal('bar');

    comboBox.renderer = null;

    expect(getFirstItem().$.content.textContent).to.equal('foo');
  });
});
