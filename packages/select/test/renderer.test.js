import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
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
          root.firstChild.items.forEach((item, index) => {
            item.textContent = items[index] + (select.__testVar || '');
          });
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

  describe('basic', () => {
    beforeEach(() => {
      select.renderer = (root) => {
        root.innerHTML = 'Content';
      };
      select.opened = true;
    });

    it('should render content by the renderer', () => {
      expect(overlay.content.childNodes).to.have.lengthOf(1);
      expect(overlay.content.textContent).to.equal('Content');
    });

    it('should clear the content when removing the renderer', () => {
      select.renderer = null;
      expect(overlay.content.childNodes).to.be.empty;
    });

    it('should not override the content on items property change', () => {
      select.items = [{ label: 'Item 1', value: 'value-1' }];
      expect(overlay.content.childNodes).to.have.lengthOf(1);
      expect(overlay.content.textContent).to.equal('Content');
    });
  });

  it('should pass root, owner arguments to the renderer', () => {
    const spy = sinon.spy();
    select.renderer = spy;
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.equal(select._overlayElement);
    expect(spy.firstCall.args[1]).to.equal(select);
  });

  it('should not throw when requesting content update before attaching to the DOM', () => {
    const select = document.createElement('vaadin-select');
    expect(() => select.requestContentUpdate()).not.to.throw(Error);
  });

  it('should run renderers when requesting content update', () => {
    select.renderer = sinon.spy();
    select.opened = true;

    select.renderer.resetHistory();
    select.requestContentUpdate();

    expect(select.renderer.calledOnce).to.be.true;
  });

  it('should ensure menu element is defined when requesting content update', () => {
    let content = rendererContent;
    content.id = 'foo';
    select.renderer = (root) => {
      root.innerHTML = '';
      root.appendChild(content);
    };
    expect(select._menuElement.id).to.equal(content.id);

    // Mimic creating new list-box in Lit render
    content = rendererContent.cloneNode(true);
    content.id = 'bar';

    select.requestContentUpdate();
    expect(select._menuElement.id).to.equal(content.id);
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

  describe('child list-box', () => {
    beforeEach(async () => {
      // Mimic the Flow component behavior
      select.appendChild(rendererContent);
      // Wait for list-box items to be set
      await nextFrame();
    });

    it('should work with list-box connected before renderer is set', () => {
      select.renderer = (root) => {
        const listBox = Array.from(select.children).find((el) => el.tagName.toLowerCase() === 'vaadin-list-box');
        if (listBox) {
          if (root.firstChild) {
            root.removeChild(root.firstChild);
          }
          root.appendChild(listBox);
        }
      };
      expect(select._items).to.eql(rendererContent.items);
    });
  });
});
