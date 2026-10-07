import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';

describe('properties', () => {
  let menu;

  afterEach(() => {
    menu.close();
  });

  describe('openOn', () => {
    beforeEach(async () => {
      menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
      await nextRender();
    });

    it('should open on custom event', async () => {
      menu.openOn = 'click';
      await nextRender();

      menu.click();
      await nextRender();

      expect(menu.opened).to.eql(true);
    });

    it('should not open on `contextmenu`', async () => {
      menu.openOn = 'click';
      await nextRender();

      fire(menu, 'contextmenu');
      await nextRender();

      expect(menu.opened).to.eql(false);
    });

    describe('event listener', () => {
      it('should not add listener when set to empty', async () => {
        expect(menu._oldOpenOn).to.be.ok;
        menu.openOn = '';
        await nextRender();
        expect(menu._oldOpenOn).not.to.be.ok;
      });
    });
  });

  describe('opened', () => {
    beforeEach(async () => {
      menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
      await nextRender();
    });

    it('should be read-only', async () => {
      expect(menu.opened).to.eql(false);

      menu.opened = true;
      await nextRender();
      expect(menu.opened).to.eql(false);
    });

    it('should be set using the private setter', async () => {
      expect(menu.opened).to.eql(false);

      menu._setOpened(true);
      await nextRender();
      expect(menu.opened).to.be.true;
    });
  });

  describe('external target', () => {
    let wrapper, target;

    beforeEach(async () => {
      wrapper = fixtureSync(`
        <div>
          <vaadin-context-menu></vaadin-context-menu>
          <section>
            <div id="target"></div>
          </section>
        </div>
      `);
      await nextRender();
      menu = wrapper.firstElementChild;
      target = wrapper.querySelector('#target');

      menu.listenOn = target;
    });

    it('should open on external target', async () => {
      fire(target, 'contextmenu');
      await nextRender();

      expect(menu.opened).to.eql(true);
    });

    it('should use context selector on external target', async () => {
      menu.selector = 'section'; // Parent of #target
      menu.listenOn = menu.parentElement;
      fire(target, 'contextmenu');
      await nextRender();

      expect(menu._context.target).to.eql(target.parentElement);
    });

    describe('event listeners', () => {
      it('should not target listeners when set to null', async () => {
        expect(menu._oldOpenOn).to.be.ok;
        menu.listenOn = null;
        await nextRender();
        expect(menu._oldOpenOn).not.to.be.ok;
      });
    });
  });

  describe('theme attribute', () => {
    beforeEach(async () => {
      menu = fixtureSync('<vaadin-context-menu theme="foo"></vaadin-context-menu>');
      await nextRender();
    });

    it('should propagate theme attribute to overlay', () => {
      expect(menu._overlayElement.getAttribute('theme')).to.equal('foo');
    });
  });
});
