import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-lumo-styles/src/global/index.css';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/radio-button.css';
import '../src/vaadin-radio-button.js';

describe('radio button with Lumo', () => {
  let radio, label;

  beforeEach(async () => {
    radio = fixtureSync('<vaadin-radio-button disabled label="Label"></vaadin-radio-button>');
    await nextRender();
    label = radio.querySelector('label');
  });

  it('should not let the label receive pointer events when disabled', () => {
    const rect = label.getBoundingClientRect();
    expect(getComputedStyle(label).pointerEvents).to.equal('none');
    const target = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    expect(target).to.not.be.oneOf([radio, radio.inputElement, label]);
  });
});
