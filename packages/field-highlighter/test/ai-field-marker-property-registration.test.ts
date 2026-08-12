import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-ai-field-marker.js';

// A separate file so the assertion runs on a page where no field has been
// marked: injecting the marker stylesheet into the document would register the
// property as a side effect and hide a missing registration.
describe('ai field marker custom property', () => {
  it('should register the mask position property on import', () => {
    // An @property rule is ignored inside a shadow tree, so the registration
    // cannot come from the stylesheet injected into the field's root node — for
    // a field nested in another component that root node is a shadow root.
    const host = fixtureSync<HTMLDivElement>(`<div></div>`);
    host.attachShadow({ mode: 'open' });
    const probe = document.createElement('div');
    host.shadowRoot!.appendChild(probe);

    const maskPos = getComputedStyle(probe).getPropertyValue('--vaadin-ai-field-marker-mask-pos');
    expect(maskPos.trim()).to.not.equal('');
  });

  it('should register the mask position property as a length', () => {
    // A value that is not a length falls back to the initial value, which is
    // what makes the property animatable by the shimmer keyframes.
    const host = fixtureSync<HTMLDivElement>(`<div style="--vaadin-ai-field-marker-mask-pos: red"></div>`);

    const maskPos = getComputedStyle(host).getPropertyValue('--vaadin-ai-field-marker-mask-pos');
    expect(maskPos.trim()).to.equal('0px');
  });

  it('should not inherit the mask position property', () => {
    // The mask position is animated per element, so a field must not pick up
    // the position of an ancestor that is being animated.
    const host = fixtureSync<HTMLDivElement>(`
      <div style="--vaadin-ai-field-marker-mask-pos: 10px">
        <div></div>
      </div>
    `);

    const maskPos = getComputedStyle(host.firstElementChild!).getPropertyValue('--vaadin-ai-field-marker-mask-pos');
    expect(maskPos.trim()).to.equal('0px');
  });
});
