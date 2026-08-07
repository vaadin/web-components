import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import './fixtures/mock-animated-overlay.js';

// A transition on the overlay itself, of the kind a theme could apply, and a content
// animation that outlives the animation of the overlay
const styles = document.createElement('style');
styles.textContent = `
  mock-animated-overlay.transitioned { transition: opacity 5s; }
  mock-animated-overlay.transitioned[opening] { opacity: 0.9; }
  .slow-content { animation: 5s slow-content-animation; }

  @keyframes slow-content-animation {
    to { opacity: 0.5; }
  }
`;
document.head.appendChild(styles);

/**
 * The computed style can promise an animation that the browser never creates. A keyframes
 * rule that does not exist reproduces that state in every engine: `animation-name` and
 * `animation-duration` both resolve, but no animation runs and no `animationend` is ever
 * dispatched. This is the shape of the Safari defect in #12363, where the overlay was left
 * waiting for an event that could not arrive.
 */
describe('animation promised by the style but never created', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>content</mock-animated-overlay>');
    // Wins over the --no-op animation from the base styles, and names keyframes that do not exist
    overlay.style.animationName = '--does-not-exist';
    overlay.style.animationDuration = '10s';
    await nextRender();
  });

  it('should report an animation in the computed style but create none', () => {
    overlay.opened = true;
    const style = getComputedStyle(overlay);
    expect(style.animationName).to.equal('--does-not-exist');
    expect(parseFloat(style.animationDuration)).to.be.above(0);
    expect(overlay.getAnimations()).to.be.empty;
  });

  it('should not wait for the opening animation', async () => {
    overlay.opened = true;
    await aTimeout(50);
    expect(overlay.hasAttribute('opening')).to.be.false;
  });

  it('should not wait for the closing animation', async () => {
    overlay.opened = true;
    await aTimeout(50);

    overlay.opened = false;
    await aTimeout(50);
    expect(overlay.hasAttribute('closing')).to.be.false;
    expect(overlay.matches(':popover-open')).to.be.false;
  });
});

/**
 * Only CSS animations report the opening and closing state. Transitions and animations started
 * from script also show up in `getAnimations()`, and are long lived enough to hold the overlay
 * open for as long as they run.
 */
describe('animations that do not report the state', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay>content</mock-animated-overlay>');
    await nextRender();
  });

  afterEach(() => {
    overlay.opened = false;
  });

  it('should not wait for a transition on the overlay', async () => {
    overlay.classList.add('transitioned');

    overlay.opened = true;
    await aTimeout(50);

    expect(overlay.hasAttribute('opening')).to.be.false;
  });

  it('should not wait for an animation started from script', async () => {
    overlay.animate([{ opacity: 1 }, { opacity: 0.9 }], 5000);

    overlay.opened = true;
    await aTimeout(50);

    expect(overlay.hasAttribute('opening')).to.be.false;
  });

  it('should not wait for a content animation that outlives the overlay animation', async () => {
    // 50ms on the overlay itself, against 5s on the content
    overlay.setAttribute('animate', '');
    overlay.appendChild(Object.assign(document.createElement('div'), { className: 'slow-content' }));

    overlay.opened = true;
    await aTimeout(300);

    expect(overlay.hasAttribute('opening')).to.be.false;
  });
});

/**
 * A phase can be finished synchronously by `_flushAnimation()` while its animations are still
 * running. Those animations are then cancelled, which settles the promise the phase was waiting
 * on, and the callback must not run a second time.
 */
describe('phase finished before its animations settle', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay long-animation>content</mock-animated-overlay>');
    await nextRender();
  });

  afterEach(() => {
    overlay._flushAnimation('opening');
    overlay._flushAnimation('closing');
    overlay.opened = false;
  });

  it('should stay open when reopened while the closing animation runs', async () => {
    overlay.opened = true;
    overlay._flushAnimation('opening');
    overlay.opened = false;

    // Reopening flushes the closing phase, and the cancelled closing animation settles later
    overlay.opened = true;
    await aTimeout(100);

    expect(overlay.hasAttribute('closing')).to.be.false;
    expect(overlay.matches(':popover-open')).to.be.true;
  });

  it('should not fire closed again when the flushed closing animation settles', async () => {
    overlay.opened = true;
    overlay._flushAnimation('opening');
    overlay.opened = false;
    overlay._flushAnimation('closing');

    const spy = sinon.spy();
    overlay.addEventListener('vaadin-overlay-closed', spy);
    await aTimeout(100);

    expect(spy).to.be.not.called;
  });
});

/**
 * Closing while the opening animation still runs removes `opening` and adds `closing` in the
 * same task, which cancels the opening animation and starts the closing one. The animations
 * have to be observable at that point, or the overlay closes without animating.
 */
describe('closed while still opening', () => {
  let overlay;

  beforeEach(async () => {
    overlay = fixtureSync('<mock-animated-overlay long-animation>content</mock-animated-overlay>');
    await nextRender();
  });

  afterEach(() => {
    overlay._flushAnimation('opening');
    overlay._flushAnimation('closing');
    overlay.opened = false;
  });

  it('should wait for the closing animation', () => {
    overlay.opened = true;
    overlay.opened = false;

    expect(overlay.hasAttribute('closing')).to.be.true;
  });
});
