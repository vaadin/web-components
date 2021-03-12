import { expect } from '@esm-bundle/chai';
import { aTimeout, click, fixtureSync, isIOS, makeSoloTouchEvent } from '@vaadin/testing-helpers';
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

class MenuWrapper extends PolymerElement {
  static get template() {
    return html`
      <vaadin-context-menu id="menu">
        <template>foo</template>
      </vaadin-context-menu>
      <button on-click="_showMenu" id="button">Show context menu</button>
    `;
  }

  _showMenu(e) {
    this.$.menu.open(e);
  }
}

customElements.define('menu-wrapper', MenuWrapper);

describe('integration', () => {
  let wrapper, menu, button, overlay;

  beforeEach(() => {
    wrapper = fixtureSync('<menu-wrapper></menu-wrapper>');
    menu = wrapper.$.menu;
    button = wrapper.$.button;
    overlay = menu.$.overlay;
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
