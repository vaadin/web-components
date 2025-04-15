import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './not-animated-styles.js';
import '../src/vaadin-select.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

describe('renderer', () => {
  let select;
  let overlay;
  let rendererContent;

  function generateRendererWithItems(items) {
    return function (root, select) {
      if (root.firstChild) {
        root.firstChild.items?.forEach((item, index) => {
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

  beforeEach(async () => {
    select = fixtureSync(`<vaadin-select></vaadin-select>`);
    await nextRender();
    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    rendererContent = document.createElement('vaadin-list-box');
    const rendererItem = document.createElement('vaadin-item');
    rendererItem.textContent = 'renderer item';
    rendererContent.appendChild(rendererItem);
  });

  describe('basic', () => {
    beforeEach(async () => {
      select.renderer = (root) => {
        root.innerHTML = 'Content';
      };
      await nextUpdate(select);
      select.opened = true;
      await nextRender();
    });

    it('should render content by the renderer', () => {
      expect(overlay.childNodes).to.have.lengthOf(1);
      expect(overlay.textContent).to.equal('Content');
    });

    it('should clear the content when removing the renderer', async () => {
      select.renderer = null;
      await nextUpdate(select);
      expect(overlay.childNodes).to.be.empty;
    });

    it('should not override the content on items property change', async () => {
      select.items = [{ label: 'Item 1', value: 'value-1' }];
      await nextUpdate(select);
      expect(overlay.childNodes).to.have.lengthOf(1);
      expect(overlay.textContent).to.equal('Content');
    });
  });

  it('should pass root, owner arguments to the renderer', async () => {
    const spy = sinon.spy();
    select.renderer = spy;
    await nextUpdate(select);
    expect(spy.calledOnce).to.be.true;
    expect(spy.firstCall.args[0]).to.equal(select._overlayElement);
    expect(spy.firstCall.args[1]).to.equal(select);
  });

  it('should not throw when requesting content update before attaching to the DOM', () => {
    const select = document.createElement('vaadin-select');
    expect(() => select.requestContentUpdate()).not.to.throw(Error);
  });

  it('should run renderers when requesting content update', async () => {
    select.renderer = sinon.spy();
    select.opened = true;
    await nextUpdate(select);

    select.renderer.resetHistory();
    select.requestContentUpdate();

    expect(select.renderer.calledOnce).to.be.true;
  });

  it('should ensure menu element is defined when requesting content update', async () => {
    let content = rendererContent;
    content.id = 'foo';
    select.renderer = (root) => {
      root.innerHTML = '';
      root.appendChild(content);
    };
    await nextUpdate(select);
    expect(select._menuElement.id).to.equal(content.id);

    // Mimic creating new list-box in Lit render
    content = rendererContent.cloneNode(true);
    content.id = 'bar';

    select.requestContentUpdate();
    expect(select._menuElement.id).to.equal(content.id);
  });

  it('should update selected value after renderer is called', async () => {
    select.renderer = generateRendererWithItems(['foo', 'bar']);
    await nextUpdate(select);
    select.value = 'bar';
    select.__testVar = 'baz';
    select.requestContentUpdate();
    await nextUpdate(select);
    expect(select._menuElement.selected).to.be.equal(1);
    const valueButton = select.querySelector('vaadin-select-value-button');
    expect(valueButton.textContent.trim()).to.be.equal('barbaz');
  });

  it('should update selected value after renderer is reassigned based on the value', async () => {
    select.renderer = generateRendererWithItems(['foo', 'bar']);
    await nextUpdate(select);
    select.value = 'bar';
    select.renderer = generateRendererWithItems(['bar', 'foo']);
    await nextUpdate(select);
    await nextUpdate(select._menuElement);
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
      await nextUpdate(select);
    });

    it('should work with list-box connected before renderer is set', async () => {
      select.renderer = (root) => {
        const listBox = Array.from(select.children).find((el) => el.tagName.toLowerCase() === 'vaadin-list-box');
        if (listBox) {
          if (root.firstChild) {
            root.removeChild(root.firstChild);
          }
          root.appendChild(listBox);
        }
      };
      await nextUpdate(select);
      expect(select._items).to.eql(rendererContent.items);
    });
  });
});
