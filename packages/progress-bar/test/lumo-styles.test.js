import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/progress-bar.css';
import '../vaadin-progress-bar.js';

describe('progress bar lumo styles', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-progress-bar value="0.5"></vaadin-progress-bar>');
  });

  it('optional border preserves dimensions and supports a custom color', async () => {
    await nextRender();
    const height = element.getBoundingClientRect().height;
    const bar = element.shadowRoot.querySelector('[part="bar"]');
    element.style.setProperty('--vaadin-progress-bar-border-width', '1px');
    expect(getComputedStyle(bar).boxShadow).to.include('0px 0px 0px 1px inset');
    expect(element.getBoundingClientRect().height).to.equal(height);

    element.style.setProperty('--vaadin-progress-bar-border-color', 'rgb(255, 0, 0)');
    expect(getComputedStyle(bar).boxShadow).to.include('rgb(255, 0, 0)');
  });
});
