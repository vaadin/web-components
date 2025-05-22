import { expect } from '@vaadin/chai-plugins';
import { nextRender } from '@vaadin/testing-helpers';
import '@vaadin/radio-group/src/vaadin-radio-group.js';
import '@vaadin/tooltip/src/vaadin-tooltip.js';

describe('radio-group with tooltip', () => {
  let group, tooltip, radio1, radio2, label;

  beforeEach(async () => {
    group = document.createElement('vaadin-radio-group');
    group.label = 'Size';
    document.body.appendChild(group);

    radio1 = document.createElement('vaadin-radio-button');
    radio1.value = 's';
    radio1.label = 'S';
    group.appendChild(radio1);

    radio2 = document.createElement('vaadin-radio-button');
    radio2.value = 'm';
    radio2.label = 'M';
    group.appendChild(radio2);

    tooltip = document.createElement('vaadin-tooltip');
    tooltip.slot = 'tooltip';
    tooltip.text = 'If not selected, M is used';
    group.appendChild(tooltip);

    await nextRender();
    label = tooltip.querySelector('[slot="sr-label"]');
  });

  afterEach(() => {
    group.remove();
  });

  it('should link tooltip with input elements using aria-describedby', () => {
    expect(radio1.inputElement.getAttribute('aria-describedby')).to.equal(label.id);
    expect(radio2.inputElement.getAttribute('aria-describedby')).to.equal(label.id);
  });

  it('should set aria-describedby on the newly added radio button input', async () => {
    const radio = document.createElement('vaadin-radio-button');
    radio.value = 'xl';
    group.appendChild(radio);
    await nextRender();
    expect(radio.inputElement.getAttribute('aria-describedby')).to.equal(label.id);
  });

  it('should remove aria-describedby from the removed radio button input', async () => {
    group.removeChild(radio1);
    await nextRender();
    expect(radio1.inputElement.hasAttribute('aria-describedby')).to.be.false;
  });

  it('should remove aria-describedby when the tooltip element is removed', async () => {
    group.removeChild(tooltip);
    await nextRender();
    expect(radio1.inputElement.hasAttribute('aria-describedby')).to.be.false;
    expect(radio2.inputElement.hasAttribute('aria-describedby')).to.be.false;
  });
});
