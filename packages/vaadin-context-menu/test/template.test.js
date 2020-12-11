import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { fire, listenOnce } from './common.js';
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

  it('should stamp template on open', (done) => {
    expect(menu.$.overlay.content).to.be.undefined;

    listenOnce(menu, 'opened-changed', () => {
      expect(menu.$.overlay.content.textContent).to.contain('FOOBAR');
      done();
    });

    menu._setOpened(true);
  });

  it('should bind target property', (done) => {
    listenOnce(menu, 'opened-changed', () => {
      expect(menu.$.overlay.content.textContent).to.contain('target');
      done();
    });

    fire(target, 'vaadin-contextmenu');
  });

  it('should bind detail property', (done) => {
    listenOnce(menu, 'opened-changed', () => {
      expect(menu.$.overlay.content.textContent).to.contain('bar');
      done();
    });

    fire(target, 'vaadin-contextmenu', { foo: 'bar' });
  });
});
