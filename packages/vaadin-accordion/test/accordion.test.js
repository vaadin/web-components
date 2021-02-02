import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { keyboardEventFor, keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import '../vaadin-accordion.js';

const iOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function arrowDown(target) {
  keyDownOn(target, 40, [], 'ArrowDown');
}

function arrowUp(target) {
  keyDownOn(target, 38, [], 'ArrowUp');
}

function home(target) {
  keyDownOn(target, 36, [], 'Home');
}

function end(target) {
  keyDownOn(target, 35, [], 'End');
}

describe('vaadin-accordion', () => {
  let accordion, heading;

  function getHeading(idx) {
    return accordion.items[idx].focusElement;
  }

  beforeEach(() => {
    accordion = fixtureSync(`
      <vaadin-accordion>
        <vaadin-accordion-panel>
          <div slot="summary">Panel 1</div>
          <input />
        </vaadin-accordion-panel>
        <vaadin-accordion-panel>
          <div slot="summary">Panel 2</div>
          Content 2
        </vaadin-accordion-panel>
        <vaadin-accordion-panel>
          <div slot="summary">Panel 3</div>
          Content 3
        </vaadin-accordion-panel>
      </vaadin-accordion>
    `);
    accordion._observer.flush();
  });

  describe('custom element definition', () => {
    it('should define a custom element with proper tag name', () => {
      expect(customElements.get('vaadin-accordion')).to.be.ok;
    });

    it('should have a valid version number', () => {
      expect(accordion.constructor.version).to.match(/^(\d+\.)?(\d+\.)?(\d+)(-(alpha|beta)\d+)?$/);
    });
  });

  describe('items', () => {
    it('should set items to the array of child panels', () => {
      expect(accordion.items).to.be.an('array');
      expect(accordion.items.length).to.be.equal(3);
    });

    it('should update items value when removing nodes', () => {
      accordion.removeChild(accordion.items[2]);
      accordion._observer.flush();
      expect(accordion.items.length).to.be.equal(2);
    });

    it('should update items value when adding nodes', () => {
      const panel = document.createElement('vaadin-accordion-panel');
      accordion.appendChild(panel);
      accordion._observer.flush();
      expect(accordion.items.length).to.be.equal(4);
    });

    it('should update items value when moving nodes', () => {
      const [p0, p2] = [accordion.items[0], accordion.items[2]];
      accordion.insertBefore(p2, p0);
      accordion._observer.flush();
      expect(accordion.items[0]).to.be.equal(p2);
      expect(accordion.items[1]).to.be.equal(p0);
    });
  });

  describe('opened', () => {
    it('should open the first panel by default', () => {
      expect(accordion.opened).to.equal(0);
      expect(accordion.items[0].opened).to.be.true;
    });

    it('should reflect opened property to attribute', () => {
      expect(accordion.hasAttribute('opened')).to.be.true;
    });

    it('should update opened to new index when other panel is opened', () => {
      getHeading(1).click();
      expect(accordion.items[1].opened).to.be.true;
      expect(accordion.opened).to.equal(1);
    });

    it('should close currently opened panel when another one is opened', () => {
      getHeading(1).click();
      expect(accordion.items[1].opened).to.be.true;
      expect(accordion.items[0].opened).to.be.false;
    });

    it('should set opened to null when the opened panel is closed', () => {
      getHeading(0).click();
      expect(accordion.items[0].opened).to.be.false;
      expect(accordion.opened).to.equal(null);
    });

    it('should close currently opened panel when opened set to null', () => {
      accordion.opened = null;
      expect(accordion.items[0].opened).to.be.false;
    });

    it('should not change opened state if panel has been removed', () => {
      const panel = accordion.items[1];
      accordion.removeChild(panel);
      accordion._observer.flush();
      panel.opened = true;
      expect(accordion.opened).to.equal(0);
    });

    it('should dispatch opened-changed event when opened changes', () => {
      const spy = sinon.spy();
      accordion.addEventListener('opened-changed', spy);
      getHeading(1).click();
      expect(spy.calledOnce).to.be.true;
    });
  });

  (iOS ? describe.skip : describe)('focus', () => {
    it('should focus the first panel heading by default', () => {
      accordion.focus();
      expect(accordion.items[0].hasAttribute('focused')).to.be.true;
    });

    it('should focus the next enabled panel heading if first is disabled', () => {
      accordion.items[0].disabled = true;
      const focusSpy = sinon.spy(accordion.items[1], 'focus');
      accordion.focus();
      expect(focusSpy.called).to.be.true;
    });

    it('should not focus any panel if all the panels are disabled', () => {
      accordion.items.forEach((item) => (item.disabled = true));
      const spies = accordion.items.map((item) => sinon.spy(item, 'focus'));
      accordion.focus();
      spies.forEach((spy) => {
        expect(spy.called).to.be.false;
      });
    });

    it('should not throw when calling `focus()` before items are set', () => {
      const focus = () => document.createElement('vaadin-accordion').focus();
      expect(focus()).to.not.throw;
    });
  });

  (iOS ? describe.skip : describe)('keyboard navigation', () => {
    beforeEach(() => {
      accordion.focus();
    });

    describe('moving focus', () => {
      it('should move focus to the next panel on "arrow-down" keydown', () => {
        heading = getHeading(0);
        arrowDown(heading);
        expect(accordion.items[1].hasAttribute('focused')).to.be.true;
        expect(accordion.items[1].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the previous panel on "arrow-up" keydown', () => {
        heading = getHeading(0);
        arrowDown(heading);
        heading = getHeading(1);
        arrowUp(heading);
        expect(accordion.items[0].hasAttribute('focused')).to.be.true;
        expect(accordion.items[0].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the first panel on "home" keydown', () => {
        accordion.items[2].focus();
        heading = getHeading(2);
        home(heading);
        expect(accordion.items[0].hasAttribute('focused')).to.be.true;
        expect(accordion.items[0].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the second panel if first is disabled on "home" keydown', () => {
        accordion.items[0].disabled = true;
        accordion.items[2].focus();
        heading = getHeading(2);
        home(heading);
        expect(accordion.items[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to the last panel on "end" keydown', () => {
        heading = getHeading(0);
        end(heading);
        expect(accordion.items[2].hasAttribute('focused')).to.be.true;
        expect(accordion.items[2].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the closest enabled panel if last is disabled on "end" keydown', () => {
        accordion.items[2].disabled = true;
        heading = getHeading(0);
        end(heading);
        expect(accordion.items[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to first panel on "arrow-down", if last element has focus', () => {
        accordion.items[2].focus();
        heading = getHeading(2);
        arrowDown(heading);
        expect(accordion.items[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to last panel on "arrow-up", if first element has focus', () => {
        heading = getHeading(0);
        arrowUp(heading);
        expect(accordion.items[2].hasAttribute('focused')).to.be.true;
      });

      it('should not move focus but set focus-ring if all the panels except one are disabled', () => {
        accordion.items[1].disabled = true;
        accordion.items[2].disabled = true;
        heading = getHeading(0);
        expect(accordion.items[0].hasAttribute('focus-ring')).to.be.true;
      });

      it('should not move focus on keydown event from the panel content', () => {
        const spy = sinon.spy(accordion.items[1], 'focus');
        arrowDown(accordion.items[0].querySelector('input'));
        expect(spy.called).to.be.false;
      });
    });

    describe('keydown event', () => {
      it('should prevent default on the keydown event when focusing another panel', () => {
        const event = keyboardEventFor('keydown', 40, [], 'ArrowDown');
        const preventSpy = sinon.spy(event, 'preventDefault');
        accordion.items[2].disabled = true;
        heading = getHeading(0);
        heading.dispatchEvent(event);
        expect(preventSpy.calledOnce).to.be.true;
      });

      it('should prevent default if all the panels except one are disabled', () => {
        const event = keyboardEventFor('keydown', 40, [], 'ArrowDown');
        const preventSpy = sinon.spy(event, 'preventDefault');
        accordion.items[1].disabled = true;
        accordion.items[2].disabled = true;
        heading = getHeading(0);
        heading.dispatchEvent(event);
        expect(preventSpy.called).to.be.true;
      });

      it('should not prevent default on keydown event from the panel content', () => {
        const event = keyboardEventFor('keydown', 27, [], 'Esc');
        const preventSpy = sinon.spy(event, 'preventDefault');
        const input = accordion.items[0].querySelector('input');
        input.dispatchEvent(event);
        expect(preventSpy.called).to.be.false;
      });

      it('should not prevent default on keydown if the key is unrelated to focus', () => {
        const event = keyboardEventFor('keydown', 27, [], 'Esc');
        const preventSpy = sinon.spy(event, 'preventDefault');
        heading = getHeading(0);
        heading.dispatchEvent(event);
        expect(preventSpy.called).to.be.false;
      });
    });
  });
});
