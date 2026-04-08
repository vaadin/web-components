import { resetMouse, sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumb.css';
import '../../../vaadin-breadcrumb.js';

describe('breadcrumb', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-breadcrumb>Label</vaadin-breadcrumb>', div);
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('basic', () => {
    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(div, 'disabled');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });
  });
});
