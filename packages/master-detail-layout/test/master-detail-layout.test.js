import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, keyDownOn, mousedown } from '@vaadin/testing-helpers';
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
  });

  describe('expand', () => {
    it('should be set to master by default', () => {
      expect(layout.expand).to.equal('master');
    });
  });

  describe('resize observer', () => {
    let onResizeSpy;

    beforeEach(() => {
      onResizeSpy = sinon.spy(layout, '__writeLayoutState');
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

  describe('focus', () => {
    let detailContent, button;

    beforeEach(async () => {
      layout.masterSize = '300px';
      layout.detailSize = '300px';
      layout.style.width = '400px';

      detailContent = layout.querySelector('[slot="detail"]');
      button = document.createElement('button');
      button.textContent = 'Focusable';
      detailContent.appendChild(button);

      // Remove detail to start without it
      detailContent.remove();
      await onceResized(layout);
    });

    it('should focus detail content with preventScroll when detail opens as overlay', async () => {
      const spy = sinon.spy(button, 'focus');
      layout.appendChild(detailContent);
      await onceResized(layout);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.equal({ preventScroll: true, focusVisible: false });
    });

    it('should focus detail content with focusVisible when keyboard is active', async () => {
      const spy = sinon.spy(button, 'focus');
      keyDownOn(document.body, 9);
      layout.appendChild(detailContent);
      await onceResized(layout);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.equal({ preventScroll: true, focusVisible: true });
    });

    it('should focus detail content without focusVisible when mouse is active', async () => {
      const spy = sinon.spy(button, 'focus');
      keyDownOn(document.body, 9);
      mousedown(document.body);
      layout.appendChild(detailContent);
      await onceResized(layout);
      expect(spy).to.be.calledOnce;
      expect(spy.firstCall.args[0]).to.deep.equal({ preventScroll: true, focusVisible: false });
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
