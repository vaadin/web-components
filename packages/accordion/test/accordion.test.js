import { expect } from '@esm-bundle/chai';
import {
  arrowDownKeyDown,
  arrowUpKeyDown,
  endKeyDown,
  fixtureSync,
  homeKeyDown,
  isIOS,
  keyboardEventFor,
  nextFrame,
} from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-accordion.js';

describe('vaadin-accordion', () => {
  let accordion, heading;

  function getHeading(idx) {
    return accordion.items[idx].focusElement;
  }

  beforeEach(async () => {
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
    await nextFrame();
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = accordion.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
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

  (isIOS ? describe.skip : describe)('focus', () => {
    it('should focus the first panel heading by default', () => {
      accordion.focus();
      expect(accordion.items[0].hasAttribute('focused')).to.be.true;
    });

    it('should focus the next enabled panel heading if first is disabled', () => {
      accordion.items[0].disabled = true;
      const focusSpy = sinon.spy(accordion.items[1], 'focus');
      accordion.focus();
      expect(focusSpy.calledOnce).to.be.true;
    });

    it('should not focus any panel if all the panels are disabled', () => {
      accordion.items.forEach((item) => {
        item.disabled = true;
      });
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

  (isIOS ? describe.skip : describe)('keyboard navigation', () => {
    beforeEach(() => {
      accordion.focus();
    });

    describe('moving focus', () => {
      it('should move focus to the next panel on "arrow-down" keydown', () => {
        heading = getHeading(0);
        arrowDownKeyDown(heading);
        expect(accordion.items[1].hasAttribute('focused')).to.be.true;
        expect(accordion.items[1].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the previous panel on "arrow-up" keydown', () => {
        heading = getHeading(0);
        arrowDownKeyDown(heading);
        heading = getHeading(1);
        arrowUpKeyDown(heading);
        expect(accordion.items[0].hasAttribute('focused')).to.be.true;
        expect(accordion.items[0].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the first panel on "home" keydown', () => {
        accordion.items[2].focus();
        heading = getHeading(2);
        homeKeyDown(heading);
        expect(accordion.items[0].hasAttribute('focused')).to.be.true;
        expect(accordion.items[0].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the second panel if first is disabled on "home" keydown', () => {
        accordion.items[0].disabled = true;
        accordion.items[2].focus();
        heading = getHeading(2);
        homeKeyDown(heading);
        expect(accordion.items[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to the last panel on "end" keydown', () => {
        heading = getHeading(0);
        endKeyDown(heading);
        expect(accordion.items[2].hasAttribute('focused')).to.be.true;
        expect(accordion.items[2].hasAttribute('focus-ring')).to.be.true;
      });

      it('should move focus to the closest enabled panel if last is disabled on "end" keydown', () => {
        accordion.items[2].disabled = true;
        heading = getHeading(0);
        endKeyDown(heading);
        expect(accordion.items[1].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to first panel on "arrow-down", if last element has focus', () => {
        accordion.items[2].focus();
        heading = getHeading(2);
        arrowDownKeyDown(heading);
        expect(accordion.items[0].hasAttribute('focused')).to.be.true;
      });

      it('should move focus to last panel on "arrow-up", if first element has focus', () => {
        heading = getHeading(0);
        arrowUpKeyDown(heading);
        expect(accordion.items[2].hasAttribute('focused')).to.be.true;
      });

      it('should not move focus but set focus-ring if all the panels except one are disabled', () => {
        accordion.items[1].disabled = true;
        accordion.items[2].disabled = true;
        heading = getHeading(0);
        arrowDownKeyDown(heading);
        expect(accordion.items[0].hasAttribute('focus-ring')).to.be.true;
      });

      it('should not move focus on keydown event from the panel content', () => {
        const spy = sinon.spy(accordion.items[1], 'focus');
        const input = accordion.items[0].querySelector('input');
        arrowDownKeyDown(input);
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
        expect(preventSpy.calledOnce).to.be.true;
      });

      it('should not prevent default on keydown event from the panel content', () => {
        const event = keyboardEventFor('keydown', 27, [], 'Escape');
        const preventSpy = sinon.spy(event, 'preventDefault');
        const input = accordion.items[0].querySelector('input');
        input.dispatchEvent(event);
        expect(preventSpy.called).to.be.false;
      });

      it('should not prevent default on keydown if the key is unrelated to focus', () => {
        const event = keyboardEventFor('keydown', 27, [], 'Escape');
        const preventSpy = sinon.spy(event, 'preventDefault');
        heading = getHeading(0);
        heading.dispatchEvent(event);
        expect(preventSpy.called).to.be.false;
      });
    });
  });
});
