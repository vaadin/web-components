import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import sinon from 'sinon';

describe('vaadin-input-container', () => {
  let container;
  let input;

  beforeEach(async () => {
    container = fixtureSync(`
      <vaadin-input-container>
        <input>
      </vaadin-input-container>
    `);
    await nextRender();
    input = container.firstElementChild;
  });

  function dispatchPointerDown(element) {
    const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    return event;
  }

  it('should reflect readonly property to attribute', async () => {
    container.readonly = true;
    await nextUpdate(container);
    expect(container.hasAttribute('readonly')).to.be.true;

    container.readonly = false;
    await nextUpdate(container);
    expect(container.hasAttribute('readonly')).to.be.false;
  });

  it('should reflect disabled property to attribute', async () => {
    container.disabled = true;
    await nextUpdate(container);
    expect(container.hasAttribute('disabled')).to.be.true;

    container.disabled = false;
    await nextUpdate(container);
    expect(container.hasAttribute('disabled')).to.be.false;
  });

  it('should reflect invalid property to attribute', async () => {
    container.invalid = true;
    await nextUpdate(container);
    expect(container.hasAttribute('invalid')).to.be.true;

    container.invalid = false;
    await nextUpdate(container);
    expect(container.hasAttribute('invalid')).to.be.false;
  });

  it('should cancel input container pointerdown to avoid blurring input', () => {
    const event = dispatchPointerDown(container);
    expect(event.defaultPrevented).to.be.true;
  });

  it('should not cancel input pointerdown', () => {
    const event = dispatchPointerDown(input);
    expect(event.defaultPrevented).to.be.false;
  });

  it('should focus the input on input container click', () => {
    const focusSpy = sinon.spy(input, 'focus');
    container.click();
    expect(focusSpy.called).to.be.true;
  });

  it('should not focus the input on input click', () => {
    const focusSpy = sinon.spy(input, 'focus');
    input.click();
    expect(focusSpy.called).to.be.false;
  });
});
