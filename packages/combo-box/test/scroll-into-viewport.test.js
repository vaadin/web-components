import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, focusout, nextRender, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-combo-box.js';

describe('scrolling input into the visual viewport', () => {
  let comboBox, input, scrollIntoView;

  function setVisualViewportHeight(height) {
    Object.defineProperty(window.visualViewport, 'height', {
      configurable: true,
      get: () => height,
    });
  }

  async function open() {
    comboBox.open();
    await oneEvent(comboBox.$.overlay, 'vaadin-overlay-open');
  }

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    comboBox.items = ['foo', 'bar'];
    await nextRender();
    input = comboBox.inputElement;
    scrollIntoView = sinon.stub(input, 'scrollIntoView');
  });

  afterEach(() => {
    // Remove the stubbed getter to restore the native accessor
    delete window.visualViewport.height;
    comboBox.opened = false;
  });

  describe('input focus retained on outside click', () => {
    beforeEach(() => {
      // The flag is only set on iOS (see `_openedChanged`), so drive it directly
      comboBox.__inputFocusRetained = true;
    });

    it('should scroll the input into view on open when the on-screen keyboard covers it', async () => {
      setVisualViewportHeight(input.getBoundingClientRect().top - 10);
      await open();
      expect(scrollIntoView).to.be.calledOnceWithExactly({ block: 'center' });
    });

    it('should not scroll the input on open when it is inside the visible area', async () => {
      await open();
      expect(scrollIntoView).to.not.be.called;
    });

    it('should scroll the input when the visual viewport shrinks over it after open', async () => {
      await open();
      expect(scrollIntoView).to.not.be.called;

      // The on-screen keyboard finishes opening: the visible area ends above the input
      setVisualViewportHeight(input.getBoundingClientRect().top - 10);
      window.visualViewport.dispatchEvent(new Event('resize'));
      expect(scrollIntoView).to.be.calledOnce;
    });

    it('should stop correcting on viewport resize once the overlay is closed', async () => {
      await open();
      comboBox.close();

      setVisualViewportHeight(input.getBoundingClientRect().top - 10);
      window.visualViewport.dispatchEvent(new Event('resize'));
      expect(scrollIntoView).to.not.be.called;
    });

    describe('correction timeout', () => {
      let clock;

      beforeEach(() => {
        clock = sinon.useFakeTimers({ shouldClearNativeTimers: true });
      });

      afterEach(() => {
        clock.restore();
      });

      it('should stop correcting on viewport resize after the timeout', async () => {
        comboBox.open();
        // Fire the overlay rAF + setTimeout chain dispatching `vaadin-overlay-open`
        await clock.tickAsync(100);
        // Expire the correction window
        await clock.tickAsync(500);

        setVisualViewportHeight(input.getBoundingClientRect().top - 10);
        window.visualViewport.dispatchEvent(new Event('resize'));
        expect(scrollIntoView).to.not.be.called;
      });
    });

    it('should not scroll the input on open after the input loses focus', async () => {
      setVisualViewportHeight(input.getBoundingClientRect().top - 10);
      focusout(comboBox);
      await open();
      expect(scrollIntoView).to.not.be.called;
    });

    it('should reset the retained focus state on close', async () => {
      setVisualViewportHeight(input.getBoundingClientRect().top - 10);
      await open();
      expect(scrollIntoView).to.be.calledOnce;

      // Close recomputes the flag from the actual environment (non-iOS here),
      // so retention forced while open must not survive into the next open.
      comboBox.__inputFocusRetained = true;
      comboBox.close();
      await nextRender();

      await open();
      expect(scrollIntoView).to.be.calledOnce;
    });

    it('should skip the correction when the overlay open event fires after close', async () => {
      setVisualViewportHeight(input.getBoundingClientRect().top - 10);

      // The overlay dispatches `vaadin-overlay-open` from a timeout that closing
      // does not cancel, so the event can arrive while the combo-box is closed
      comboBox.$.overlay.dispatchEvent(new CustomEvent('vaadin-overlay-open'));
      expect(scrollIntoView).to.not.be.called;

      // The retained focus state must survive for the next real open
      await open();
      expect(scrollIntoView).to.be.calledOnce;
    });
  });

  it('should not scroll the input on open when focus was not retained', async () => {
    setVisualViewportHeight(input.getBoundingClientRect().top - 10);
    await open();
    expect(scrollIntoView).to.not.be.called;
  });
});
