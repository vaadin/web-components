import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@open-wc/testing-helpers';
import { fire } from './common.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('properties', () => {
  let menu;

  afterEach(() => {
    menu.close();
  });

  describe('context', () => {
    let target;

    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu>
          <template></template>
          <section>
            <div id="target"></div>
          </section>
        </vaadin-context-menu>
      `);
      target = menu.querySelector('#target');
    });

    it('should use event target as context target', () => {
      fire(target, 'contextmenu');

      expect(menu._context.target).to.eql(target);
    });

    it('should use context-selector scope to target', () => {
      menu.selector = 'section';

      fire(target, 'contextmenu');

      expect(menu._context.target).to.eql(target.parentElement);
    });
  });

  describe('openOn', () => {
    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu>
          <template></template>
        </vaadin-context-menu>
      `);
    });

    it('should open on custom event', () => {
      menu.openOn = 'click';

      menu.click();

      expect(menu.opened).to.eql(true);
    });

    it('should not open on `contextmenu`', () => {
      menu.openOn = 'click';

      fire(menu, 'contextmenu');

      expect(menu.opened).to.eql(false);
    });

    describe('event listener', () => {
      it('should not add listener when set to empty', () => {
        expect(menu._oldOpenOn).to.be.ok;
        menu.openOn = '';
        expect(menu._oldOpenOn).not.to.be.ok;
      });
    });
  });

  describe('opened', () => {
    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu>
          <template></template>
        </vaadin-context-menu>
      `);
    });

    it('should be read-only', () => {
      expect(menu.opened).to.eql(false);

      menu.opened = true;
      expect(menu.opened).to.eql(false);
    });

    it('should be set using the private setter', () => {
      expect(menu.opened).to.eql(false);

      menu._setOpened(true);
      expect(menu.opened).to.be.true;
    });
  });

  describe('closeOn', () => {
    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu>
          <template></template>
        </vaadin-context-menu>
      `);
      menu._setOpened(true);
    });

    it('should not close on `click`', () => {
      menu.closeOn = '';

      menu.$.overlay.dispatchEvent(new CustomEvent('click'));

      expect(menu.opened).to.eql(true);
    });

    it('should close on custom event', () => {
      menu.closeOn = 'foobar';

      fire(menu.$.overlay, 'foobar');

      expect(menu.opened).to.eql(false);
    });
  });

  describe('external target', () => {
    let wrapper, target;

    beforeEach(() => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-context-menu>
            <template></template>
          </vaadin-context-menu>
          <section>
            <div id="target"></div>
          </section>
        </div>
      `);
      menu = wrapper.firstElementChild;
      target = wrapper.querySelector('#target');

      menu.listenOn = target;
    });

    it('should open on external target', () => {
      fire(target, 'contextmenu');

      expect(menu.opened).to.eql(true);
    });

    it('should select context target on external target', () => {
      fire(target, 'contextmenu');

      expect(menu._context.target).to.eql(target);
    });

    it('should use context selector on external target', () => {
      menu.selector = 'section'; // parent of #target
      menu.listenOn = menu.parentElement;
      fire(target, 'contextmenu');

      expect(menu._context.target).to.eql(target.parentElement);
    });

    describe('event listeners', () => {
      it('should not target listeners when set to null', () => {
        expect(menu._oldOpenOn).to.be.ok;
        menu.listenOn = null;
        expect(menu._oldOpenOn).not.to.be.ok;
      });
    });
  });

  describe('theme attribute', () => {
    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu theme="foo">
          <template></template>
        </vaadin-context-menu>
      `);
    });

    it('should propagate theme attribute to overlay', () => {
      expect(menu.$.overlay.getAttribute('theme')).to.equal('foo');
    });
  });
});
