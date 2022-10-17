import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync } from '@vaadin/testing-helpers';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('template', () => {
  let menu, target;

  beforeEach(() => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <template>FOOBAR [[detail.foo]] [[target.id]]</template>
        <div id="target"></div>
      </vaadin-context-menu>
    `);
    target = document.querySelector('#target');
  });

  it('should stamp template on open', () => {
    menu._setOpened(true);

    expect(menu.$.overlay.textContent).to.contain('FOOBAR');
  });

  it('should bind target property', () => {
    fire(target, 'vaadin-contextmenu');

    expect(menu.$.overlay.textContent).to.contain('target');
  });

  it('should bind detail property', () => {
    fire(target, 'vaadin-contextmenu', { foo: 'bar' });

    expect(menu.$.overlay.textContent).to.contain('bar');
  });
});
