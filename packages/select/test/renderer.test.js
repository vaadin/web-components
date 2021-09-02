import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import './not-animated-styles.js';
import '../vaadin-select.js';

describe('renderer', () => {
  let select;
  let overlay;
  let rendererContent;

  function generateRendererWithItems(items) {
    return function (root, select) {
      if (root.firstChild) {
        root.firstChild.items &&
          root.firstChild.items.forEach((item, index) => (item.textContent = items[index] + (select.__testVar || '')));
        return;
      }

      const listBox = document.createElement('vaadin-list-box');
      items.forEach((text) => {
        const item = document.createElement('vaadin-item');
        item.textContent = text + (select.__testVar || '');
        item.value = text;
        listBox.appendChild(item);
      });
      root.appendChild(listBox);
    };
  }

  beforeEach(() => {
    select = fixtureSync(`<vaadin-select></vaadin-select>`);
    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    rendererContent = document.createElement('vaadin-list-box');
    const rendererItem = document.createElement('vaadin-item');
    rendererItem.textContent = 'renderer item';
    rendererContent.appendChild(rendererItem);
  });

  it('should use renderer when it is defined', () => {
    select.renderer = (root) => root.appendChild(rendererContent);
    expect(select.shadowRoot.querySelector('vaadin-list-box vaadin-item').textContent.trim()).to.equal('renderer item');
  });

  it('should pass vaadin-select as owner to vaadin-overlay', () => {
    select.renderer = (_, owner) => {
      expect(owner).to.eql(select);
    };
  });

  it('should run renderers when requesting content update', () => {
    select.renderer = sinon.spy();
    select.opened = true;

    select.renderer.resetHistory();
    select.requestContentUpdate();

    expect(select.renderer.calledOnce).to.be.true;
  });

  it('should request content update when calling deprecated render()', () => {
    const stub = sinon.stub(select, 'requestContentUpdate');
    select.opened = true;
    select.render();
    stub.restore();

    expect(stub.calledOnce).to.be.true;
  });

  it('should warn when calling deprecated render()', () => {
    const stub = sinon.stub(console, 'warn');
    select.opened = true;
    select.render();
    stub.restore();

    expect(stub.calledOnce).to.be.true;
    expect(stub.args[0][0]).to.equal(
      'WARNING: Since Vaadin 21, render() is deprecated. Please use requestContentUpdate() instead.'
    );
  });

  it('should update selected value after renderer is called', async () => {
    select.renderer = generateRendererWithItems(['foo', 'bar']);
    await nextFrame();
    select.value = 'bar';
    select.__testVar = 'baz';
    select.requestContentUpdate();
    await nextFrame();
    expect(select._menuElement.selected).to.be.equal(1);
    expect(select._valueButton.textContent.trim()).to.be.equal('barbaz');
  });

  it('should update selected value after renderer is reassigned based on the value', async () => {
    select.renderer = generateRendererWithItems(['foo', 'bar']);
    await nextFrame();
    select.value = 'bar';
    select.renderer = generateRendererWithItems(['bar', 'foo']);
    await nextFrame();
    expect(select.value).to.equal('bar');
    expect(select._menuElement.selected).to.equal(0);
  });

  it('should not throw when setting renderer before overlay is ready', () => {
    expect(() => {
      const select = document.createElement('vaadin-select');
      select.renderer = () => {};
      document.body.appendChild(select);
      document.body.removeChild(select);
    }).to.not.throw(Error);
  });

  it('should clear the select content when removing the renderer', () => {
    select.renderer = (root) => {
      root.innerHTML = 'foo';
    };
    select.opened = true;

    expect(overlay.content.textContent).to.equal('foo');

    select.renderer = null;

    expect(overlay.content.textContent).to.equal('');
  });
});
