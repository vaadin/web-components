import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import './not-animated-styles.js';
import '@vaadin/accordion';
import '@vaadin/dialog';

describe('accordion in dialog', () => {
  let dialog, overlay, accordion, panels;

  beforeEach(async () => {
    dialog = fixtureSync(`<vaadin-dialog></vaadin-dialog>`);
    dialog.renderer = (root) => {
      root.innerHTML = `
        <vaadin-accordion>
          <vaadin-accordion-panel>
            <div slot="summary">Panel 1</div>
            <button>Button 1</button>
          </vaadin-accordion-panel>
          <vaadin-accordion-panel>
            <div slot="summary">Panel 2</div>
            <button>Button 2</button>
          </vaadin-accordion-panel>
        </vaadin-accordion>
      `;
    };
    dialog.opened = true;
    overlay = dialog.$.overlay;
    await oneEvent(overlay, 'vaadin-overlay-open');
    await nextFrame();
    accordion = overlay.querySelector('vaadin-accordion');
    panels = accordion.items;
  });

  it('should move focus from panel heading to content on Tab', async () => {
    // Focus first panel (opened)
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(panels[0]);

    // Move focus to the content
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(panels[0].querySelector('button'));
  });

  it('should move focus from panel content to heading on Shift + Tab', async () => {
    // Focus the first panel content
    panels[0].querySelector('button').focus();

    // Move focus back to heading
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });

    expect(document.activeElement).to.equal(panels[0]);
  });

  it('should skip focusable element in closed panel on Tab', async () => {
    accordion.opened = 1;

    // Focus first panel (closed)
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(panels[0]);

    // Focus second panel (opened)
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement).to.equal(panels[1]);
  });

  it('should skip focusable element in closed panel on Shift + Tab', async () => {
    accordion.opened = 1;

    // Focus second panel (opened)
    panels[1].focus();

    // Move focus back to first panel
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });

    expect(document.activeElement).to.equal(panels[0]);
  });
});
