import { expect } from '@vaadin/chai-plugins';
import { isEventConsumed, markEventConsumed } from '../src/event-utils.js';

describe('event-utils', () => {
  let event;

  beforeEach(() => {
    event = new MouseEvent('click');
  });

  it('should not mark event as consumed by default', () => {
    expect(isEventConsumed(event)).to.be.false;
  });

  it('should mark event as consumed', () => {
    markEventConsumed(event);
    expect(isEventConsumed(event)).to.be.true;
  });

  it('should not mark other events as consumed', () => {
    markEventConsumed(event);
    expect(isEventConsumed(new MouseEvent('click'))).to.be.false;
  });

  it('should not prevent default when marking event as consumed', () => {
    event = new MouseEvent('click', { cancelable: true });
    markEventConsumed(event);
    expect(event.defaultPrevented).to.be.false;
  });
});
