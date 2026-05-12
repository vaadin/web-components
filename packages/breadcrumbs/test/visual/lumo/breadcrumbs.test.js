import { expect } from '@vaadin/chai-plugins';
import { resetMouse, sendKeys, sendMouseToElement } from '@vaadin/test-runner-commands';
import { fixtureSync, mousedown, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumbs.css';
import '@vaadin/vaadin-lumo-styles/components/icon.css';
import '../not-animated-styles.js';
import '../../../src/vaadin-breadcrumbs.js';
import '@vaadin/icon';
import '@vaadin/icons';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbsComponent = true;

describe('breadcrumbs', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.padding = '10px';
  });

  afterEach(async () => {
    await resetMouse();
  });

  describe('default trail', () => {
    beforeEach(async () => {
      fixtureSync(
        `
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        `,
        div,
      );
      await nextRender();
    });

    it('default-trail', async () => {
      await visualDiff(div, 'default-trail');
    });
  });

  describe('icon trail', () => {
    beforeEach(async () => {
      fixtureSync(
        `
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">
              <vaadin-icon icon="vaadin:home" slot="prefix"></vaadin-icon>
              Home
            </vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item path="/docs">Docs</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        `,
        div,
      );
      await nextRender();
    });

    it('icon-trail', async () => {
      await visualDiff(div, 'icon-trail');
    });
  });

  describe('link item states', () => {
    let item;

    beforeEach(async () => {
      // Render a trail with a single linked item plus a current item so the
      // separator and layout are present, but interaction targets the link.
      fixtureSync(
        `
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/foo">Link</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        `,
        div,
      );
      await nextRender();
      item = div.querySelector('vaadin-breadcrumbs-item[path="/foo"]');
    });

    it('link-item-default', async () => {
      await visualDiff(div, 'link-item-default');
    });

    it('link-item-hover', async () => {
      await sendMouseToElement({ type: 'move', element: item });
      await visualDiff(div, 'link-item-hover');
    });

    it('link-item-focus', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'link-item-focus');
    });

    it('link-item-active', async () => {
      mousedown(item);
      await visualDiff(div, 'link-item-active');
    });

    it('link-item-disabled', async () => {
      // No `disabled` property exists on <vaadin-breadcrumbs-item> today;
      // setting the attribute is enough for the implementation agent to
      // hook `:host([disabled])` styles in the Lumo CSS.
      item.setAttribute('disabled', '');
      await nextRender();
      await visualDiff(div, 'link-item-disabled');
    });
  });

  describe('current page', () => {
    beforeEach(async () => {
      fixtureSync(
        `
          <vaadin-breadcrumbs>
            <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
            <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
          </vaadin-breadcrumbs>
        `,
        div,
      );
      await nextRender();
    });

    it('current-page', async () => {
      await visualDiff(div, 'current-page');
    });
  });

  it('item font size equals 1rem', async () => {
    fixtureSync(
      `
        <vaadin-breadcrumbs>
          <vaadin-breadcrumbs-item path="/">Home</vaadin-breadcrumbs-item>
          <vaadin-breadcrumbs-item>Current</vaadin-breadcrumbs-item>
        </vaadin-breadcrumbs>
      `,
      div,
    );
    document.body.appendChild(div);
    await nextRender();

    const item = div.querySelector('vaadin-breadcrumbs-item');
    // Default Lumo root font size is 16px, so --lumo-font-size-m (1rem) = 16px.
    expect(getComputedStyle(item).fontSize).to.equal('16px');
  });
});
