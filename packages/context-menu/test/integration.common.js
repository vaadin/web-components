import { expect } from '@vaadin/chai-plugins';
import { aTimeout, click, fixtureSync, isIOS, makeSoloTouchEvent, nextRender } from '@vaadin/testing-helpers';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';

class MenuWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-context-menu id="menu" renderer="[[_renderer]]"></vaadin-context-menu>
      <button on-click="_showMenu" id="button" style="margin: 20px">Show context menu</button>
    `;
  }

  constructor() {
    super();

    this._renderer = (root) => {
      root.textContent = 'foo';
    };
  }

  _showMenu(e) {
    this.$.menu.open(e);
  }
}

customElements.define('menu-wrapper', MenuWrapper);

describe('integration', () => {
  let wrapper, menu, button, overlay;

  beforeEach(async () => {
    wrapper = fixtureSync('<menu-wrapper></menu-wrapper>');
    await nextRender();
    menu = wrapper.$.menu;
    button = wrapper.$.button;
    overlay = menu._overlayElement;
  });

  it('should open context menu on .open(e)', () => {
    click(button);
    expect(menu.opened).to.eql(true);
  });

  (isIOS ? it.skip : it)('should open context menu below button', async () => {
    makeSoloTouchEvent('click', { y: 0, x: 0 }, button);
    await aTimeout(100);
    const buttonRect = button.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    expect(overlayRect.left).to.be.closeTo(buttonRect.left, 0.1);
    expect(overlayRect.top).to.be.closeTo(buttonRect.top + buttonRect.height, 0.1);
  });
});
