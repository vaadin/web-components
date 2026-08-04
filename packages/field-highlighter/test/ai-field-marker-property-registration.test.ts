import { expect } from '@vaadin/chai-plugins';
import '../src/vaadin-ai-field-marker.js';

// A separate file so the assertion runs on a page where no field has been
// marked: injecting the marker stylesheet into the document would register the
// property as a side effect and hide a missing registration.
describe('ai field marker custom property', () => {
  let host: HTMLDivElement;

  afterEach(() => {
    host.remove();
  });

  it('should register the mask position property on import', () => {
    // An @property rule is ignored inside a shadow tree, so the registration
    // cannot come from the stylesheet injected into the field's root node — for
    // a field nested in another component that root node is a shadow root.
    host = document.createElement('div');
    host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    const probe = document.createElement('div');
    host.shadowRoot!.appendChild(probe);

    const maskPos = getComputedStyle(probe).getPropertyValue('--vaadin-ai-field-marker-mask-pos');
    expect(maskPos.trim()).to.not.equal('');
  });
});
