import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { aTimeout, fixtureSync, nextFrame, nextRender, nextResize } from '@vaadin/testing-helpers';
import '../src/vaadin-app-layout.js';
import type { AppLayout } from '../src/vaadin-app-layout.js';

describe('dedicated bottom navigation', () => {
  let layout: AppLayout;
  let navbarTop: HTMLElement;
  let navbarBottom: HTMLElement;
  let content: HTMLElement;

  const bottomMarkup = '<nav slot="navbar-bottom" style="height: 60px;"><a href="#mobile">Mobile</a></nav>';
  const legacyMarkup = '<nav slot="navbar touch-optimized" style="height: 80px;"><a href="#legacy">Legacy</a></nav>';

  async function createLayout(touchOptimized: boolean, markup = bottomMarkup) {
    layout = fixtureSync(`
      <vaadin-app-layout style="
        height: 300px;
        --vaadin-app-layout-touch-optimized: ${touchOptimized};
        --vaadin-app-layout-drawer-overlay: false;
        --vaadin-app-layout-drawer-width: 120px;
        --vaadin-app-layout-transition-duration: 0s;
        --vaadin-app-layout-navbar-padding-top: 0px;
        --vaadin-app-layout-navbar-padding-bottom: 0px;
      ">
        <nav slot="navbar" style="height: 40px;"><a href="#desktop">Desktop</a></nav>
        ${markup}
        <aside slot="drawer">Drawer</aside>
        <main style="height: 600px;"><a href="#content">Content</a></main>
      </vaadin-app-layout>
    `);
    await nextRender();
    navbarTop = layout.shadowRoot!.querySelector<HTMLElement>('[part~="navbar-top"]')!;
    navbarBottom = layout.shadowRoot!.querySelector<HTMLElement>('[part~="navbar-bottom"]')!;
    content = layout.shadowRoot!.querySelector<HTMLElement>('[part~="content"]')!;
    await nextResize(layout);
    await nextFrame();
  }

  function expectMode(touchOptimized: boolean) {
    expect(getComputedStyle(navbarTop).display).to.equal(touchOptimized ? 'none' : 'flex');
    expect(getComputedStyle(navbarBottom).display).to.equal(touchOptimized ? 'flex' : 'none');
    expect(layout.hasAttribute('has-navbar')).to.equal(!touchOptimized);
    const style = getComputedStyle(layout);
    expect(parseFloat(style.paddingTop)).to.equal(navbarTop.getBoundingClientRect().height);
    expect(parseFloat(style.paddingBottom)).to.equal(navbarBottom.getBoundingClientRect().height);
    expect(parseFloat(touchOptimized ? style.paddingTop : style.paddingBottom)).to.equal(0);
  }

  async function switchMode(touchOptimized: boolean) {
    layout.style.setProperty('--vaadin-app-layout-touch-optimized', String(touchOptimized));
    layout.style.width = touchOptimized ? '500px' : '600px';
    await nextResize(layout);
    await nextFrame();
  }

  it('should recognize author-assigned bottom content previously used in the top navbar', async () => {
    await createLayout(false, legacyMarkup);
    const legacy = layout.querySelector('[href="#legacy"]')!.parentElement!;
    legacy.slot = 'navbar-bottom';
    await aTimeout(0);
    await switchMode(true);
    expect(legacy.slot).to.equal('navbar-bottom');
    expectMode(true);
  });

  it('should preserve automatic switching when legacy content moves between layout instances', async () => {
    await createLayout(true, legacyMarkup);
    const legacy = layout.querySelector('[href="#legacy"]')!.parentElement!;
    const otherLayout: AppLayout = fixtureSync(`
      <vaadin-app-layout style="--vaadin-app-layout-touch-optimized: false;"></vaadin-app-layout>
    `);
    otherLayout.appendChild(legacy);
    await nextRender();
    expect(legacy.slot).to.equal('navbar');
  });

  [false, true].forEach((touchOptimized) => {
    describe(`touch-optimized: ${touchOptimized}`, () => {
      describe('explicit content', () => {
        beforeEach(async () => {
          await createLayout(touchOptimized);
        });

        it('should show only the active navbar container and reserve only its height', () => {
          expectMode(touchOptimized);
          expect(layout.querySelector('nav[slot="navbar"]')).to.exist;
          expect(layout.querySelector('nav[slot="navbar-bottom"]')).to.exist;
          const drawer = layout.shadowRoot!.querySelector<HTMLElement>('[part~="drawer"]')!;
          expect(getComputedStyle(drawer).top).to.equal(getComputedStyle(layout).paddingTop);
          expect(getComputedStyle(drawer).bottom).to.equal(getComputedStyle(layout).paddingBottom);
          expect(content.clientHeight).to.equal(300 - (touchOptimized ? 60 : 40));
        });

        it('should switch containers and offsets in both directions', async () => {
          await switchMode(!touchOptimized);
          expectMode(!touchOptimized);
          await switchMode(touchOptimized);
          expectMode(touchOptimized);
        });

        it('should exclude the inactive navigation from keyboard focus', async () => {
          const desktop = layout.querySelector<HTMLAnchorElement>('[href="#desktop"]')!;
          const mobile = layout.querySelector<HTMLAnchorElement>('[href="#mobile"]')!;
          const main = layout.querySelector<HTMLAnchorElement>('[href="#content"]')!;
          const hidden = touchOptimized ? desktop : mobile;
          hidden.focus();
          expect(document.activeElement).not.to.equal(hidden);
          (touchOptimized ? main : desktop).focus();
          await sendKeys({ press: 'Tab' });
          expect(document.activeElement).to.equal(touchOptimized ? mobile : main);
        });

        it('should keep the end of scrollable content above the bottom navbar', () => {
          layout.style.height = '100vh';
          content.scrollTop = content.scrollHeight;
          const main = layout.querySelector('main')!;
          expect(main.getBoundingClientRect().bottom).to.be.closeTo(content.getBoundingClientRect().bottom, 1);
          if (touchOptimized) {
            expect(content.getBoundingClientRect().bottom).to.be.closeTo(navbarBottom.getBoundingClientRect().top, 1);
          }
        });

        it('should preserve safe-area padding without reserving space for the hidden navbar', async () => {
          layout.style.setProperty('--safe-area-inset-top', '20px');
          layout.style.setProperty('--safe-area-inset-bottom', '30px');
          await nextResize(layout);
          await nextFrame();
          expectMode(touchOptimized);
          expect(getComputedStyle(content).paddingTop).to.equal(touchOptimized ? '20px' : '0px');
          expect(getComputedStyle(content).paddingBottom).to.equal(touchOptimized ? '0px' : '30px');
          expect(getComputedStyle(touchOptimized ? navbarBottom : navbarTop).paddingBlockEnd).to.equal(
            touchOptimized ? '30px' : '0px',
          );
        });

        it('should update offsets when the active navigation height changes', async () => {
          const navbar = layout.querySelector<HTMLElement>(`[slot="${touchOptimized ? 'navbar-bottom' : 'navbar'}"]`)!;
          navbar.style.height = '100px';
          await nextResize(layout);
          await nextFrame();
          expectMode(touchOptimized);
          expect(getComputedStyle(layout)[touchOptimized ? 'paddingBottom' : 'paddingTop']).to.equal('100px');
        });

        it('should keep newly added legacy content hidden without changing its slot', async () => {
          const legacy = document.createElement('nav');
          legacy.slot = 'navbar touch-optimized';
          layout.appendChild(legacy);
          await aTimeout(0);
          expect(legacy.slot).to.equal('navbar touch-optimized');
          expect(legacy.getBoundingClientRect().height).to.equal(0);
          expectMode(touchOptimized);
        });
      });

      describe('mixed content', () => {
        beforeEach(async () => {
          await createLayout(touchOptimized, bottomMarkup + legacyMarkup);
        });

        it('should ignore legacy navigation while explicit bottom content is present', () => {
          const legacy = layout.querySelector<HTMLElement>('[href="#legacy"]')!.parentElement!;
          expect(legacy.slot).to.equal('navbar touch-optimized');
          expect(legacy.getBoundingClientRect().height).to.equal(0);
          expectMode(touchOptimized);
        });

        it('should restore legacy navigation when the last explicit bottom element is removed', async () => {
          layout.querySelector('[slot="navbar-bottom"]')!.remove();
          await aTimeout(0);
          const legacy = layout.querySelector<HTMLElement>('[href="#legacy"]')!.parentElement!;
          expect(legacy.slot).to.equal(touchOptimized ? 'navbar-bottom' : 'navbar');
          expect(legacy.getBoundingClientRect().height).to.equal(80);
          expect(getComputedStyle(navbarTop).display).to.equal('flex');
          expect(getComputedStyle(navbarBottom).display).to.equal(touchOptimized ? 'flex' : 'none');
          expect(getComputedStyle(layout).paddingTop).to.equal(touchOptimized ? '40px' : '80px');
          expect(getComputedStyle(layout).paddingBottom).to.equal(touchOptimized ? '80px' : '0px');
        });

        it('should retain explicit precedence until all explicit bottom elements are removed', async () => {
          const extra = document.createElement('nav');
          extra.slot = 'navbar-bottom';
          extra.style.height = '60px';
          layout.appendChild(extra);
          await aTimeout(0);
          layout.querySelector('[href="#mobile"]')!.parentElement!.remove();
          await aTimeout(0);
          expectMode(touchOptimized);
          expect(layout.querySelector('[href="#legacy"]')!.parentElement!.slot).to.equal('navbar touch-optimized');
        });

        it('should restore legacy navigation when explicit content changes slots', async () => {
          layout.querySelector<HTMLElement>('[slot="navbar-bottom"]')!.slot = '';
          await aTimeout(0);
          expect(layout.querySelector('[href="#legacy"]')!.parentElement!.slot).to.equal(
            touchOptimized ? 'navbar-bottom' : 'navbar',
          );
        });
      });

      describe('adding explicit content to a legacy layout', () => {
        beforeEach(async () => {
          await createLayout(touchOptimized, legacyMarkup);
        });

        it('should not confuse automatically moved content with explicit bottom content', () => {
          expect(getComputedStyle(navbarTop).display).to.equal('flex');
          expect(getComputedStyle(navbarBottom).display).to.equal(touchOptimized ? 'flex' : 'none');
          expect(layout.querySelector('[href="#legacy"]')!.parentElement!.slot).to.equal(
            touchOptimized ? 'navbar-bottom' : 'navbar',
          );
        });

        it('should hide previously moved legacy content when explicit content is added', async () => {
          const bottom = document.createElement('nav');
          bottom.slot = 'navbar-bottom';
          bottom.style.height = '60px';
          layout.appendChild(bottom);
          await aTimeout(0);
          const legacy = layout.querySelector('[href="#legacy"]')!.parentElement!;
          expect(legacy.slot).to.equal('navbar touch-optimized');
          expect(legacy.getBoundingClientRect().height).to.equal(0);
          expectMode(touchOptimized);
        });

        it('should restore legacy switching after dynamically added explicit content is removed', async () => {
          const bottom = document.createElement('nav');
          bottom.slot = 'navbar-bottom';
          layout.appendChild(bottom);
          await aTimeout(0);
          bottom.remove();
          await aTimeout(0);
          expect(layout.querySelector('[href="#legacy"]')!.parentElement!.slot).to.equal(
            touchOptimized ? 'navbar-bottom' : 'navbar',
          );
          await switchMode(!touchOptimized);
          expect(layout.querySelector('[href="#legacy"]')!.parentElement!.slot).to.equal(
            touchOptimized ? 'navbar' : 'navbar-bottom',
          );
          expect(getComputedStyle(navbarTop).display).to.equal('flex');
        });

        it('should not treat nested bottom slot attributes as explicit layout content', async () => {
          const nested = document.createElement('nav');
          nested.slot = 'navbar-bottom';
          layout.querySelector('main')!.appendChild(nested);
          await switchMode(!touchOptimized);
          expect(getComputedStyle(navbarTop).display).to.equal('flex');
          expect(layout.querySelector('[href="#legacy"]')!.parentElement!.slot).to.equal(
            touchOptimized ? 'navbar' : 'navbar-bottom',
          );
        });
      });
    });
  });
});
