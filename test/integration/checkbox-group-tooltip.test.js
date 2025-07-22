import { expect } from '@vaadin/chai-plugins';
import { nextRender } from '@vaadin/testing-helpers';
import '@vaadin/checkbox-group/src/vaadin-checkbox-group.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('checkbox-group with tooltip', () => {
  let group, tooltip, checkbox1, checkbox2, label;

  beforeEach(async () => {
    group = document.createElement('vaadin-checkbox-group');
    group.label = 'Language';
    document.body.appendChild(group);

    checkbox1 = document.createElement('vaadin-checkbox');
    checkbox1.value = 'en';
    checkbox1.label = 'English';
    group.appendChild(checkbox1);

    checkbox2 = document.createElement('vaadin-checkbox');
    checkbox2.value = 'fr';
    checkbox2.label = 'Français';
    group.appendChild(checkbox2);

    tooltip = document.createElement('vaadin-tooltip');
    tooltip.slot = 'tooltip';
    tooltip.text = 'If not selected, English is used';
    group.appendChild(tooltip);

    await nextRender();
    label = tooltip.querySelector('[slot="overlay"]');
  });

  afterEach(() => {
    group.remove();
  });

  it('should link tooltip with input elements using aria-describedby', () => {
    expect(checkbox1.inputElement.getAttribute('aria-describedby')).to.equal(label.id);
    expect(checkbox2.inputElement.getAttribute('aria-describedby')).to.equal(label.id);
  });

  it('should set aria-describedby on the newly added checkbox input', async () => {
    const checkbox = document.createElement('vaadin-checkbox');
    checkbox.value = 'de';
    group.appendChild(checkbox);
    await nextRender();
    expect(checkbox.inputElement.getAttribute('aria-describedby')).to.equal(label.id);
  });

  it('should remove aria-describedby from the removed checkbox input', async () => {
    group.removeChild(checkbox1);
    await nextRender();
    expect(checkbox1.inputElement.hasAttribute('aria-describedby')).to.be.false;
  });

  it('should remove aria-describedby when the tooltip element is removed', async () => {
    group.removeChild(tooltip);
    await nextRender();
    expect(checkbox1.inputElement.hasAttribute('aria-describedby')).to.be.false;
    expect(checkbox2.inputElement.hasAttribute('aria-describedby')).to.be.false;
  });
});
