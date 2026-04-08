import { resetMouse } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';
import '../../../vaadin-breadcrumb.js';
window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.breadcrumbComponent = true;

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
    div.innerHTML = `
      <vaadin-breadcrumb>
        <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
        <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>`;
    await nextRender();
    await visualDiff(div, 'two-items');
  });

  it('single-item', async () => {
    div.innerHTML = `
      <vaadin-breadcrumb>
        <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
      </vaadin-breadcrumb>`;
    await nextRender();
    await visualDiff(div, 'single-item');
  });

  it('disabled-item', async () => {
    const items = element.querySelectorAll('vaadin-breadcrumb-item');
    items[1].disabled = true;
    await nextRender();
    await visualDiff(div, 'disabled-item');
  });

  describe('overflow', () => {
    it('partial collapse', async () => {
      div.style.width = '300px';
      div.style.display = 'block';
      div.innerHTML = `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/widgets">Widgets</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/widgets/sprockets">Sprockets</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Turbo Sprocket</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`;
      await nextRender();
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      await visualDiff(div, 'overflow-partial');
    });

    it('full collapse', async () => {
      div.style.width = '180px';
      div.style.display = 'block';
      div.innerHTML = `
        <vaadin-breadcrumb>
          <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/widgets">Widgets</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item path="/products/widgets/sprockets">Sprockets</vaadin-breadcrumb-item>
          <vaadin-breadcrumb-item>Turbo Sprocket</vaadin-breadcrumb-item>
        </vaadin-breadcrumb>`;
      await nextRender();
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      await visualDiff(div, 'overflow-full');
    });
  });
});
