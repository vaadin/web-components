import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-master-detail-layout.js';
import { onceResized } from './helpers.js';

window.Vaadin ||= {};
window.Vaadin.featureFlags ||= {};
window.Vaadin.featureFlags.masterDetailLayoutComponent = true;

describe('vaadin-master-detail-layout', () => {
  let layout, master, detail;

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout>
        <div>Master</div>
        <div slot="detail">Detail</div>
      </vaadin-master-detail-layout>
    `);
    await onceResized(layout);
    master = layout.shadowRoot.querySelector('[part="master"]');
    detail = layout.shadowRoot.querySelector('[part="detail"]');
  });

  describe('custom element definition', () => {
    it('should be defined in custom element registry', () => {
      expect(customElements.get('vaadin-master-detail-layout')).to.be.ok;
    });

    it('should have a valid localName', () => {
      expect(layout.localName).to.equal('vaadin-master-detail-layout');
    });

    it('should have display grid', () => {
      expect(getComputedStyle(layout).display).to.equal('grid');
    });
  });

  describe('detail', () => {
    it('should set has-detail when detail content is provided', () => {
      expect(layout.hasAttribute('has-detail')).to.be.true;
    });

    it('should remove has-detail when detail is removed', async () => {
      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);
      expect(layout.hasAttribute('has-detail')).to.be.false;
    });

    it('should set has-detail when detail becomes visible', async () => {
      const detailContent = layout.querySelector('[slot="detail"]');
      detailContent.hidden = true;
      await onceResized(layout);
      expect(layout.hasAttribute('has-detail')).to.be.false;

      detailContent.hidden = false;
      await onceResized(layout);
      expect(layout.hasAttribute('has-detail')).to.be.true;
    });

    it('should expand master to fill the layout when detail is removed', async () => {
      layout.masterSize = '200px';
      layout.detailSize = '200px';
      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);
      expect(master.offsetWidth).to.equal(layout.offsetWidth);
    });

    it('should expand master to fill the layout when detail is removed with expand detail', async () => {
      layout.expand = 'detail';
      layout.masterSize = '200px';
      layout.detailSize = '200px';
      layout.querySelector('[slot="detail"]').remove();
      await onceResized(layout);
      expect(master.offsetWidth).to.equal(layout.offsetWidth);
    });

    describe('display: contents wrapper', () => {
      it('should set has-detail when detail uses display: contents with visible children', async () => {
        layout.querySelector('[slot="detail"]').remove();
        await onceResized(layout);
        expect(layout.hasAttribute('has-detail')).to.be.false;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('slot', 'detail');
        wrapper.style.display = 'contents';
        wrapper.innerHTML = '<div>Detail inside contents wrapper</div>';
        layout.appendChild(wrapper);
        await onceResized(layout);

        expect(layout.hasAttribute('has-detail')).to.be.true;
      });

      it('should not set has-detail when detail uses display: contents with no children', async () => {
        layout.querySelector('[slot="detail"]').remove();
        await onceResized(layout);

        const wrapper = document.createElement('div');
        wrapper.setAttribute('slot', 'detail');
        wrapper.style.display = 'contents';
        layout.appendChild(wrapper);
        await onceResized(layout);

        expect(layout.hasAttribute('has-detail')).to.be.false;
      });

      it('should not set has-detail when detail uses display: contents with hidden children', async () => {
        layout.querySelector('[slot="detail"]').remove();
        await onceResized(layout);

        const wrapper = document.createElement('div');
        wrapper.setAttribute('slot', 'detail');
        wrapper.style.display = 'contents';
        wrapper.innerHTML = '<div hidden>Hidden detail</div>';
        layout.appendChild(wrapper);
        await onceResized(layout);

        expect(layout.hasAttribute('has-detail')).to.be.false;
      });
    });
  });

  describe('expand', () => {
    it('should be set to master by default', () => {
      expect(layout.expand).to.equal('master');
    });
  });

  describe('resize observer', () => {
    let onResizeSpy;

    beforeEach(() => {
      onResizeSpy = sinon.spy(layout, '__applyLayoutState');
    });

    it('should trigger observer when layout is resized', async () => {
      layout.style.height = '100px';
      await onceResized(layout);
      expect(onResizeSpy).to.be.called;
    });

    it('should trigger observer when master part is resized', async () => {
      layout.$.master.style.height = '100px';
      await onceResized(layout);
      expect(onResizeSpy).to.be.called;
    });

    it('should trigger observer when detail part is resized', async () => {
      layout.$.detail.style.height = '100px';
      await onceResized(layout);
      expect(onResizeSpy).to.be.called;
    });

    it('should trigger observer when a direct child is resized', async () => {
      for (const child of layout.children) {
        child.style.height = '100px';
        await onceResized(layout);
        expect(onResizeSpy).to.be.called;
        onResizeSpy.resetHistory();
      }
    });

    it('should not trigger observer when a nested layout child is resized', async () => {
      const nestedLayout = fixtureSync(
        `
          <vaadin-master-detail-layout style="height: 200px;">
            <div>Nested Master</div>
            <div slot="detail">Nested Detail</div>
          </vaadin-master-detail-layout>
        `,
      );
      layout.appendChild(nestedLayout);
      await onceResized(layout);
      onResizeSpy.resetHistory();

      [...nestedLayout.children].forEach((child) => {
        child.style.height = '100px';
      });
      await onceResized(layout);
      expect(onResizeSpy).to.be.not.called;
    });
  });

  describe('height', () => {
    it('should expand to full height of the parent', async () => {
      layout.masterSize = '200px';
      layout.detailSize = '200px';
      layout.parentElement.style.height = '500px';
      await onceResized(layout);
      expect(parseFloat(getComputedStyle(master).height)).to.equal(500);
      expect(parseFloat(getComputedStyle(detail).height)).to.equal(500);
    });
  });
});
