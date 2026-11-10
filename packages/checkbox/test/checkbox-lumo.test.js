import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/checkbox.css';
import '../src/vaadin-checkbox.js';

describe('checkbox with Lumo', () => {
  let checkbox, input, label;

  function getCenter(element) {
    const rect = element.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  }

  beforeEach(async () => {
    checkbox = fixtureSync(`
      <vaadin-checkbox required helper-text="Helper" style="width: 400px">
        <label slot="label">Label</label>
      </vaadin-checkbox>
    `);
    await nextRender();
    input = checkbox.inputElement;
    label = checkbox.querySelector('label');
  });

  it('should cover the empty space next to the label with the input', () => {
    const rect = checkbox.getBoundingClientRect();
    const [, y] = getCenter(label);
    expect(document.elementFromPoint(rect.right - 10, y)).to.equal(input);
  });

  it('should not cover the label with the input', () => {
    expect(document.elementFromPoint(...getCenter(label))).to.equal(label);
  });

  it('should let clicks on the required indicator reach the input or the label', () => {
    // In Lumo, the indicator overlaps the padding of the label
    const indicator = checkbox.shadowRoot.querySelector('[part="required-indicator"]');
    expect(document.elementFromPoint(...getCenter(indicator))).to.be.oneOf([input, label]);
  });

  it('should not let the label receive pointer events when disabled', async () => {
    checkbox.disabled = true;
    await nextRender();
    expect(document.elementFromPoint(...getCenter(label))).to.not.be.oneOf([checkbox, input, label]);
  });

  it('should not cover the helper text row with the input', () => {
    const helper = checkbox.querySelector('[slot="helper"]');
    expect(document.elementFromPoint(...getCenter(helper))).to.equal(helper);

    const rect = checkbox.getBoundingClientRect();
    const [, y] = getCenter(helper);
    expect(document.elementFromPoint(rect.left + 2, y)).to.not.equal(input);
  });
});
