import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { fire } from './common.js';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';

describe('renderer', () => {
  let menu, target;

  afterEach(() => {
    menu.close();
  });

  describe('without template', () => {
    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu>
          <div id="target"></div>
        </vaadin-context-menu>
      `);
      menu.renderer = sinon.spy((root, _, context) => {
        if (root.firstChild) {
          return;
        }
        root.appendChild(
          document.createTextNode(`Renderer ${context.detail && context.detail.foo} ${context.target.id}`)
        );
      });
      target = menu.querySelector('#target');
    });

    it('should render on open', () => {
      expect(menu.renderer.callCount).to.equal(0);

      fire(target, 'vaadin-contextmenu');

      expect(menu.renderer.callCount).to.equal(1);
      expect(menu.$.overlay.content.textContent).to.contain('Renderer');
    });

    it('should have target in context', () => {
      fire(target, 'vaadin-contextmenu');

      expect(menu.$.overlay.content.textContent).to.contain('target');
    });

    it('should have detail in context', () => {
      fire(target, 'vaadin-contextmenu', { foo: 'bar' });

      expect(menu.$.overlay.content.textContent).to.contain('bar');
    });

    it('should have contextMenu owner argument', () => {
      fire(target, 'vaadin-contextmenu');

      expect(menu.renderer.firstCall.args[1]).to.equal(menu);
    });

    it('should rerender on reopen', () => {
      fire(target, 'vaadin-contextmenu');
      menu.close();
      fire(target, 'vaadin-contextmenu');

      expect(menu.renderer.callCount).to.equal(2);
      expect(menu.renderer.getCall(1).args).to.deep.equal(menu.renderer.getCall(0).args);
    });

    it('should rerender with new target on reopen', () => {
      const otherTarget = document.createElement('div');
      menu.appendChild(otherTarget);
      fire(target, 'vaadin-contextmenu');
      menu.close();
      fire(otherTarget, 'vaadin-contextmenu');

      expect(menu.renderer.callCount).to.equal(2);
      expect(menu.renderer.getCall(0).args[2].target).to.equal(target);
      expect(menu.renderer.getCall(1).args[2].target).to.equal(otherTarget);
    });

    it('should rerender with new detail on reopen', () => {
      fire(target, 'vaadin-contextmenu', { foo: 'one' });
      menu.close();
      fire(target, 'vaadin-contextmenu', { foo: 'two' });

      expect(menu.renderer.callCount).to.equal(2);
      expect(menu.renderer.getCall(0).args[2].detail).to.deep.equal({ foo: 'one' });
      expect(menu.renderer.getCall(1).args[2].detail).to.deep.equal({ foo: 'two' });
    });

    it('should remove template when added after renderer', () => {
      menu.renderer = () => {};
      const template = document.createElement('template');
      expect(() => {
        menu.appendChild(template);
        menu._observer.flush();
      }).to.throw(Error);
      expect(menu._contentTemplate).to.be.not.ok;
    });

    it('should be possible to manually invoke renderer', () => {
      fire(target, 'vaadin-contextmenu');
      expect(menu.renderer.calledOnce).to.be.true;
      menu.render();
      expect(menu.renderer.calledTwice).to.be.true;
    });
  });

  describe('with template', () => {
    beforeEach(() => {
      menu = fixtureSync(`
        <vaadin-context-menu>
          <template>Template [[detail.foo]] [[target.id]]</template>
          <div id="target"></div>
        </vaadin-context-menu>
      `);
      target = menu.querySelector('#target');
    });

    it('should fallback to template if renderer is missing', () => {
      fire(target, 'vaadin-contextmenu', { foo: 'bar' });

      expect(menu.$.overlay.content.textContent).to.contain('Template bar target');
      expect(menu.$.overlay.content.textContent).to.not.contain('Renderer');
    });

    it('should throw an error when setting a renderer if there is already a template', () => {
      menu._observer.flush();
      expect(() => (menu.renderer = () => {})).to.throw(Error);
    });

    it('should remove renderer when added after template', () => {
      menu._observer.flush();
      expect(() => (menu.renderer = () => {})).to.throw(Error);
      expect(menu.renderer).to.be.not.ok;
    });
  });
});
