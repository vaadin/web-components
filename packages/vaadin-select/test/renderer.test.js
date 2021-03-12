import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync, nextFrame } from '@open-wc/testing-helpers';
import '@vaadin/vaadin-list-box/vaadin-list-box.js';
import '@vaadin/vaadin-item/vaadin-item.js';
import '../vaadin-select.js';

describe('renderer', () => {
  let select;
  let rendererContent;

  function generateRendererWithItems(items) {
    return function (root, select) {
      if (root.firstChild) {
        root.firstChild.items &&
          root.firstChild.items.forEach((item, index) => (item.textContent = items[index] + (select.__testVar || '')));
        return;
      }

      const listBox = window.document.createElement('vaadin-list-box');
      items.forEach((text) => {
        const item = window.document.createElement('vaadin-item');
        item.textContent = text + (select.__testVar || '');
        item.value = text;
        listBox.appendChild(item);
      });
      root.appendChild(listBox);
    };
  }

  describe('without template', () => {
    beforeEach(() => {
      select = fixtureSync(`<vaadin-select></vaadin-select>`);
      rendererContent = document.createElement('vaadin-list-box');
      const rendererItem = document.createElement('vaadin-item');
      rendererItem.textContent = 'renderer item';
      rendererContent.appendChild(rendererItem);
    });

    it('should use renderer when it is defined', () => {
      select.renderer = (root) => root.appendChild(rendererContent);
      expect(select.shadowRoot.querySelector('vaadin-list-box vaadin-item').textContent.trim()).to.equal(
        'renderer item'
      );
    });

    it('should pass vaadin-select as owner to vaadin-overlay', () => {
      select.renderer = (root, owner) => {
        expect(owner).to.eql(select);
      };
    });

    it('should be possible to manually invoke renderer', () => {
      const spy = (select.renderer = sinon.spy());
      select.opened = true;
      spy.resetHistory();
      select.render();
      expect(spy.callCount).to.equal(1);
    });

    it('should update selected value after renderer is called', async () => {
      select.renderer = generateRendererWithItems(['foo', 'bar']);
      await nextFrame();
      select.value = 'bar';
      select.__testVar = 'baz';
      select.render();
      await nextFrame();
      expect(select._menuElement.selected).to.be.equal(1);
      expect(select._valueElement.textContent.trim()).to.be.equal('barbaz');
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
  });

  describe('with template', () => {
    beforeEach(() => {
      select = fixtureSync(`
        <vaadin-select>
          <template>
            <vaadin-list-box>
              <vaadin-item>templatizer item</vaadin-item>
            </vaadin-list-box>
          </template>
        </vaadin-select>
      `);
    });

    it('should fallback to render content with Templatizer when renderer is not defined', () => {
      expect(select.shadowRoot.querySelector('vaadin-item').textContent.trim()).to.equal('templatizer item');
    });

    it('should throw an error when setting a renderer if there is already a template', () => {
      expect(() => (select.renderer = () => {})).to.throw(Error);
    });

    it('should remove renderer when added after template', () => {
      expect(() => (select.renderer = () => {})).to.throw(Error);
      expect(select.renderer).to.be.not.ok;
    });
  });
});
