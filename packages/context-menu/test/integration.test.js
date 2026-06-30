import { expect } from '@vaadin/chai-plugins';
import { click, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';

describe('integration', () => {
  let menu, button, overlay;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    await nextRender();
    const wrapper = menu.parentElement;
    wrapper.attachShadow({ mode: 'open' });
    wrapper.shadowRoot.innerHTML = `
      <slot></slot>
      <button style="margin: 20px">Show context menu</button>
    `;
    menu.renderer = (root) => {
      root.textContent = 'foo';
    };
    wrapper.addEventListener('click', (e) => {
      menu.open(e);
    });
    button = wrapper.shadowRoot.querySelector('button');
    overlay = menu._overlayElement;
  });

  it('should open context menu on .open(e)', () => {
    click(button);
    expect(menu.opened).to.eql(true);
  });

  it('should position overlay against the target on keyboard open', async () => {
    // Emulate keyboard-triggered click that reports clientX/clientY as 0
    click(button, { x: 0, y: 0 });
    await oneEvent(overlay, 'vaadin-overlay-open');
    const buttonRect = button.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    expect(overlayRect.left).to.be.closeTo(buttonRect.left, 0.1);
    expect(overlayRect.top).to.be.closeTo(buttonRect.bottom, 0.1);
  });

  it('should position overlay at the pointer on mouse open', async () => {
    click(button, { x: 100, y: 100 });
    await oneEvent(overlay, 'vaadin-overlay-open');
    const overlayRect = overlay.getBoundingClientRect();
    expect(overlayRect.left).to.be.closeTo(100, 0.1);
    expect(overlayRect.top).to.be.closeTo(100, 0.1);
  });
});
