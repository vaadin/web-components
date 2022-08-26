import { expect } from '@esm-bundle/chai';
import { click, enter, fire, fixtureSync, isIOS, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '@vaadin/item/vaadin-item.js';
import '@vaadin/list-box/vaadin-list-box.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('selection', () => {
  let menu, overlay;

  beforeEach(() => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    overlay = menu.$.overlay;
    menu.renderer = (root) => {
      root.innerHTML = `
        <vaadin-list-box id="menu">
          <vaadin-item>item1</vaadin-item>
          <vaadin-item>item2</vaadin-item>
          <vaadin-item>item3</vaadin-item>
        </vaadin-list-box>
      `;
    };
  });

  it('should close on item click', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender(overlay);

    const listBox = overlay.querySelector('#menu');
    click(listBox.items[0]);
    expect(menu.opened).to.eql(false);
  });

  it('should close on keyboard selection', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender(overlay);

    const spy = sinon.spy();
    menu.addEventListener('opened-changed', spy);

    const item = overlay.querySelector('#menu vaadin-item');
    enter(item);
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus the child element', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender(overlay);

    const item = overlay.querySelector('#menu vaadin-item');
    expect(document.activeElement).to.eql(item);
  });

  (isIOS ? it.skip : it)('should focus the child element on `contextmenu` event', async () => {
    fire(menu, 'contextmenu');
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender(overlay);

    const item = overlay.querySelector('#menu vaadin-item');
    expect(document.activeElement).to.eql(item);
  });
});
