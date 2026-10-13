import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-tooltip.js';

describe('vaadin-tooltip', () => {
  let wrapper, tooltip;

  beforeEach(async () => {
    wrapper = fixtureSync(`
      <div>
        <button id="target">Save</button>
        <vaadin-tooltip for="target" text="Save the document"></vaadin-tooltip>
      </div>
    `);
    tooltip = wrapper.querySelector('vaadin-tooltip');
    await nextRender();
  });

  it('default', async () => {
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('opened', async () => {
    tooltip.manual = true;
    tooltip.opened = true;
    await oneEvent(tooltip.$.overlay, 'vaadin-overlay-open');
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('aria-labelledby link mode', async () => {
    wrapper.querySelector('button').textContent = '';
    tooltip.ariaLinkMode = 'aria-labelledby';
    await nextUpdate(tooltip);
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('no link mode', async () => {
    tooltip.ariaLinkMode = 'none';
    await nextUpdate(tooltip);
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('aria target', async () => {
    const input = document.createElement('input');
    input.setAttribute('aria-label', 'Name');
    wrapper.prepend(input);
    tooltip.ariaTarget = input;
    await nextUpdate(tooltip);
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });

  it('markdown', async () => {
    tooltip.markdown = true;
    tooltip.text = 'Save the **document**';
    await nextUpdate(tooltip);
    await expect(wrapper).to.equalA11yTreeSnapshot();
    await expect(wrapper).to.be.accessible();
  });
});
