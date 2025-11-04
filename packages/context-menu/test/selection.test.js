import { expect } from '@vaadin/chai-plugins';
import { click, enter, fire, fixtureSync, isIOS, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-context-menu.js';
import '@vaadin/item/src/vaadin-item.js';
import '@vaadin/list-box/src/vaadin-list-box.js';

describe('selection', () => {
  let menu, overlay;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    overlay = menu._overlayElement;
    menu.renderer = (root) => {
      root.innerHTML = `
        <vaadin-list-box id="menu">
          <vaadin-item>item1</vaadin-item>
          <vaadin-item>item2</vaadin-item>
          <vaadin-item>item3</vaadin-item>
        </vaadin-list-box>
      `;
    };
    await nextRender();
  });

  it('should close on item click', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender();

    const listBox = menu.querySelector('#menu');
    click(listBox.items[0]);
    expect(menu.opened).to.eql(false);
  });

  it('should close on keyboard selection', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender();

    const spy = sinon.spy();
    menu.addEventListener('opened-changed', spy);

    const item = menu.querySelector('#menu vaadin-item');
    enter(item);
    await nextRender();
    expect(spy.calledOnce).to.be.true;
  });

  it('should focus the child element', async () => {
    menu._setOpened(true);
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender();

    const item = menu.querySelector('#menu vaadin-item');
    expect(document.activeElement).to.eql(item);
  });

  (isIOS ? it.skip : it)('should focus the child element on `contextmenu` event', async () => {
    fire(menu, 'contextmenu');
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextRender();

    const item = menu.querySelector('#menu vaadin-item');
    expect(document.activeElement).to.eql(item);
  });
});
