import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fire, fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/combo-box';
import '@vaadin/context-menu';
import '@vaadin/date-picker';
import '@vaadin/master-detail-layout';

describe('overlay in master-detail-layout', () => {
  let layout, backdrop, spy;

  async function clickBackdrop() {
    const { x, y } = backdrop.getBoundingClientRect();
    await sendMouse({ type: 'click', position: [Math.round(x + 10), Math.round(y + 10)] });
  }

  beforeEach(async () => {
    layout = fixtureSync(`
      <vaadin-master-detail-layout no-animation master-size="300px" detail-size="300px" style="width: 400px; height: 300px;">
        <div>Master</div>
        <div slot="detail">
          <vaadin-combo-box></vaadin-combo-box>
          <vaadin-date-picker></vaadin-date-picker>
          <vaadin-context-menu open-on="click">
            <button>target</button>
          </vaadin-context-menu>
        </div>
      </vaadin-master-detail-layout>
    `);
    await nextResize(layout);
    await nextRender();

    backdrop = layout.shadowRoot.querySelector('[part="backdrop"]');
    layout.querySelector('vaadin-combo-box').items = ['foo', 'bar'];

    spy = sinon.spy();
    layout.addEventListener('backdrop-click', spy);
  });

  afterEach(async () => {
    await resetMouse();
  });

  ['combo-box', 'date-picker'].forEach((component) => {
    describe(component, () => {
      let field;

      beforeEach(async () => {
        field = layout.querySelector(`vaadin-${component}`);
        field.open();
        await oneEvent(field.$.overlay, 'vaadin-overlay-open');
      });

      it(`should not fire backdrop-click when the click closes the ${component} overlay`, async () => {
        await clickBackdrop();

        expect(field.opened).to.be.false;
        expect(spy).to.not.be.called;
        expect(layout.hasAttribute('has-detail')).to.be.true;
      });

      it(`should fire backdrop-click on click after the ${component} overlay is closed`, async () => {
        await clickBackdrop();
        await clickBackdrop();

        expect(spy).to.be.calledOnce;
      });
    });
  });

  describe('context-menu', () => {
    let menu;

    beforeEach(async () => {
      menu = layout.querySelector('vaadin-context-menu');
      menu.items = [{ text: 'Item 0', children: [{ text: 'Item 0-0' }] }, { text: 'Item 1' }];
      await nextRender();

      menu.querySelector('button').click();
      await oneEvent(menu._overlayElement, 'vaadin-overlay-open');
    });

    it('should not fire backdrop-click when the click closes the context menu', async () => {
      await clickBackdrop();

      expect(menu.opened).to.be.false;
      expect(spy).to.not.be.called;
    });

    it('should not fire backdrop-click when the click closes the menu with a sub-menu open', async () => {
      const item = menu.querySelector('vaadin-context-menu-item');
      fire(item, 'mouseover');
      const subMenu = menu.querySelector('vaadin-context-menu');
      await oneEvent(subMenu._overlayElement, 'vaadin-overlay-open');

      await clickBackdrop();

      expect(menu.opened).to.be.false;
      expect(subMenu.opened).to.be.false;
      expect(spy).to.not.be.called;
    });
  });
});
