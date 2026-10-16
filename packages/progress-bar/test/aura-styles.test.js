import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '../vaadin-progress-bar.js';

describe('progress bar aura styles', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-progress-bar value="0.5"></vaadin-progress-bar>');
  });

  it('optional border uses the secondary text color and preserves dimensions', async () => {
    await nextRender();
    const height = element.getBoundingClientRect().height;
    const bar = element.shadowRoot.querySelector('[part="bar"]');
    element.style.color = 'var(--vaadin-text-color-secondary)';
    element.style.setProperty('--vaadin-progress-bar-border-width', '1px');
    expect(getComputedStyle(bar).borderWidth).to.equal('1px');
    expect(getComputedStyle(bar).borderColor).to.equal(getComputedStyle(element).color);
    expect(element.getBoundingClientRect().height).to.equal(height);

    element.style.setProperty('--vaadin-progress-bar-border-color', 'rgb(255, 0, 0)');
    expect(getComputedStyle(bar).borderColor).to.equal('rgb(255, 0, 0)');
  });
});
