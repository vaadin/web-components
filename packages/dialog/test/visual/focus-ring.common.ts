import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/button/vaadin-button.js';
import '../not-animated-styles.css';
import '../../vaadin-dialog.js';
import type { Dialog } from '../../vaadin-dialog.js';
import { createRenderer } from '../helpers.js';

export function defineContentFocusRingTests(): void {
  [
    { name: 'title-footer', header: 'title', footer: true },
    { name: 'header-footer', header: 'renderer', footer: true },
    { name: 'title-only', header: 'title', footer: false },
    { name: 'footer-only', header: 'none', footer: true },
    { name: 'wide-ring', header: 'title', footer: true, width: '6px' },
    { name: 'no-padding', header: 'title', footer: true, noPadding: true },
  ].forEach(({ name, header, footer, width, noPadding }) => {
    describe(`content focus ring: ${name}`, () => {
      let dialog: Dialog;

      beforeEach(async () => {
        const wrapper = document.createElement('div');
        wrapper.style.height = '100%';
        dialog = fixtureSync<Dialog>('<vaadin-dialog></vaadin-dialog>', wrapper);
        if (header === 'title') {
          dialog.headerTitle = 'Title';
        } else if (header === 'renderer') {
          dialog.headerRenderer = createRenderer('Header');
        }
        if (footer) {
          dialog.footerRenderer = createRenderer('Footer');
        }
        if (width) {
          dialog.style.setProperty('--vaadin-focus-ring-width', width);
        }
        if (noPadding) {
          dialog.setAttribute('theme', 'no-padding');
        }
        dialog.renderer = (root) => {
          if (!root.firstChild) {
            const button = document.createElement('vaadin-button');
            button.textContent = 'Content action';
            root.appendChild(button);
          }
        };
        dialog.opened = true;
        await nextRender();
        await sendKeys({ press: 'Tab' });
        dialog.querySelector('vaadin-button')!.focus();
        await nextRender();
      });

      it('content focus ring', async () => {
        const overlay = dialog.shadowRoot!.querySelector('vaadin-dialog-overlay')!;
        await visualDiff(overlay.shadowRoot!.querySelector<HTMLElement>('[part="overlay"]')!, name);
      });
    });
  });
}
