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

  it('should not cover the helper text row with the input', () => {
    const rect = checkbox.getBoundingClientRect();
    const [, y] = getCenter(checkbox.querySelector('[slot="helper"]'));
    expect(document.elementFromPoint(rect.left + 2, y)).to.not.equal(input);
  });
});
