import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../not-animated-styles.js';
import '../../../src/vaadin-breadcrumbs-item.js';
import '@vaadin/icon';
import '@vaadin/icons';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('breadcrumbs-item', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
  });

  describe('link', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumbs-item path="/foo">Link</vaadin-breadcrumbs-item>', div);
      await nextRender();
    });

    it('basic', async () => {
      await visualDiff(div, 'basic');
    });

    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'focus-ring');
    });

    it('disabled', async () => {
      element.disabled = true;
      await nextRender();
      await visualDiff(div, 'disabled');
    });
  });

  describe('current', () => {
    beforeEach(async () => {
      element = fixtureSync('<vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>', div);
      element._setCurrent(true);
      await nextRender();
    });

    it('current', async () => {
      await visualDiff(div, 'current');
    });
  });

  describe('prefix', () => {
    beforeEach(async () => {
      element = fixtureSync(
        `
          <vaadin-breadcrumbs-item path="/">
            <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
            Home
          </vaadin-breadcrumbs-item>
        `,
        div,
      );
      await nextRender();
    });

    it('basic', async () => {
      await visualDiff(div, 'prefix');
    });

    it('disabled', async () => {
      element.disabled = true;
      await nextRender();
      await visualDiff(div, 'disabled-prefix');
    });
  });
});
