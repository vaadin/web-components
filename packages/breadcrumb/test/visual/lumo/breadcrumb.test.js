import { resetMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumb.css';
import '@vaadin/vaadin-lumo-styles/components/breadcrumb-item.css';
import '../../../vaadin-breadcrumb.js';

describe('breadcrumb', () => {
  let div, element;

  beforeEach(async () => {
    div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.padding = '10px';
    element = fixtureSync(
      `<vaadin-breadcrumb>
        <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>`,
      div,
    );
    await nextRender();
  });

  afterEach(async () => {
    await resetMouse();
  });

  it('basic', async () => {
    await visualDiff(div, 'basic');
  });

  it('two-items', async () => {
    fixtureSync(
      `<vaadin-breadcrumb>
        <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>`,
      div,
    );
    await nextRender();
    await visualDiff(div, 'two-items');
  });

  it('single-item', async () => {
    fixtureSync(
      `<vaadin-breadcrumb>
        <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>`,
      div,
    );
    await nextRender();
    await visualDiff(div, 'single-item');
  });

  it('disabled-item', async () => {
    const items = element.querySelectorAll('vaadin-breadcrumb-item');
    items[1].disabled = true;
    await nextRender();
    await visualDiff(div, 'disabled-item');
  });
});
