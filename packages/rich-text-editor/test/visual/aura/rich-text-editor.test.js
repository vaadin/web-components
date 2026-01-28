import { resetMouse, sendMouse, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../common.js';
import '../../../vaadin-rich-text-editor.js';
import { Tooltip } from '@vaadin/tooltip';

describe('rich-text-editor', () => {
  let div, element;

  before(() => {
    Tooltip.setDefaultFocusDelay(0);
    Tooltip.setDefaultHoverDelay(0);
    Tooltip.setDefaultHideDelay(0);
  });

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-rich-text-editor></vaadin-rich-text-editor>', div);
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('disabled', async () => {
    element.disabled = true;
    await visualDiff(div, 'disabled');
  });

  it('focus', async () => {
    element.shadowRoot.querySelector('.ql-editor').focus();
    await visualDiff(div, 'focus');
  });

  describe('toolbar button', () => {
    let button;

    beforeEach(() => {
      button = element.shadowRoot.querySelector('[part~="toolbar-button-bold"]');
    });

    afterEach(async () => {
      await resetMouse();
    });

    it('hover', async () => {
      await sendMouseToElement({ type: 'move', element: button });
      await visualDiff(div, 'toolbar-button-hover');
    });

    it('pressed', async () => {
      await sendMouseToElement({ type: 'move', element: button });
      await sendMouse({ type: 'down' });
      await visualDiff(div, 'toolbar-button-pressed');
    });
  });
});
