import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextResize, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/combo-box';
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
});
