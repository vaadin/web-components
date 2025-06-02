import { expect } from '@vaadin/chai-plugins';
import { setViewport } from '@vaadin/test-runner-commands';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-app-layout.js';
import '../src/vaadin-drawer-toggle.js';
import { tab } from './helpers.js';

describe('desktop navigation', () => {
  let layout, toggle, drawerInput, contentInput, outerInput;

  before(async () => {
    await setViewport({ width: 1000, height: 1000 });
  });

  beforeEach(async () => {
    const wrapper = fixtureSync(`
      <div>
        <vaadin-app-layout style="--vaadin-app-layout-transition-duration: 0s;">
          <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
          <section slot="drawer">
            <input placeholder="Drawer input" />
          </section>
          <main>
            <input placeholder="Content input" />
          </main>
        </vaadin-app-layout>
        <input placeholder="Outer input" />
      </div>
    `);
    [layout, outerInput] = wrapper.children;
    await nextRender();
    toggle = layout.querySelector('[slot=navbar]');
    drawerInput = layout.querySelector('[slot=drawer] > input');
    contentInput = layout.querySelector(':not([slot]) > input');
  });

  it('should have focus outside the layout by default', () => {
    expect(layout.contains(document.activeElement)).to.be.false;
  });

  it('should move focus from the outside to the drawer toggle on Tab', async () => {
    await tab();
    expect(document.activeElement).to.equal(toggle);
  });

  it('should move focus from the drawer toggle to the drawer content on Tab', async () => {
    toggle.focus();
    await tab();
    expect(document.activeElement).to.equal(drawerInput);
  });

  it('should move focus from the drawer content to the layout content on Tab', async () => {
    drawerInput.focus();
    await tab();
    expect(document.activeElement).to.equal(contentInput);
  });

  it('should move focus from the layout content to outside the layout on Tab', async () => {
    contentInput.focus();
    await tab();
    expect(document.activeElement).to.equal(outerInput);
  });

  describe('drawer is closed', () => {
    beforeEach(async () => {
      toggle.focus();
      toggle.click();
      await nextFrame();
    });

    it('should move focus from the drawer toggle to the layout content on Tab', async () => {
      toggle.focus();
      await tab();
      expect(document.activeElement).to.equal(contentInput);
    });
  });
});
