import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import '../../src/vaadin-app-layout.js';

describe('vaadin-app-layout', () => {
  let layout;

  beforeEach(() => {
    layout = fixtureSync('<vaadin-app-layout></vaadin-app-layout>');
  });

  it('default', async () => {
    await expect(layout).shadowDom.to.equalSnapshot();
  });

  it('navbar', async () => {
    const content = document.createElement('div');
    content.setAttribute('slot', 'navbar');
    layout.appendChild(content);
    await nextFrame();
    await expect(layout).shadowDom.to.equalSnapshot();
  });

  it('drawer', async () => {
    const content = document.createElement('div');
    content.setAttribute('slot', 'drawer');
    layout.appendChild(content);
    await nextFrame();
    layout.drawerOpened = true;
    await expect(layout).shadowDom.to.equalSnapshot();
  });
});
