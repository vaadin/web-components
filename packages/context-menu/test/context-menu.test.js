import { expect } from '@vaadin/chai-plugins';
import { fire, fixtureSync, nextRender, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-context-menu.js';

describe('custom element definition', () => {
  let menu, tagName;

  beforeEach(() => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    tagName = menu.tagName.toLowerCase();
  });

  it('should be defined in custom element registry', () => {
    expect(customElements.get(tagName)).to.be.ok;
  });

  it('should have a valid static "is" getter', () => {
    expect(customElements.get(tagName).is).to.equal(tagName);
  });
});

describe('display', () => {
  let menu;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    await nextRender();
  });

  it('should have display: none when hidden', () => {
    menu.setAttribute('hidden', '');
    expect(getComputedStyle(menu).display).to.equal('none');
  });
});

describe('focus', () => {
  let menu, target, overlay;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <div id="target"></div>
      </vaadin-context-menu>
    `);
    await nextRender();
    target = menu.querySelector('#target');
    overlay = menu._overlayElement;
  });

  it('should focus the first rendered element on open', async () => {
    menu.renderer = (root) => {
      root.innerHTML = '<button>Edit</button><button>Delete</button>';
    };
    fire(target, 'vaadin-contextmenu');
    await oneEvent(overlay, 'vaadin-overlay-open');
    expect(document.activeElement).to.equal(overlay._contentRoot.firstElementChild);
  });
});

describe('initialization', () => {
  beforeEach(() => {
    const input = fixtureSync('<input value="foo">');
    input.select();
  });

  it('should not clear selected ranges on initialization', async () => {
    fixtureSync('<vaadin-context-menu></vaadin-context-menu>');
    await nextRender();
    expect(window.getSelection().rangeCount).to.equal(1);
  });
});

describe('theme attribute', () => {
  let menu;

  beforeEach(async () => {
    menu = fixtureSync('<vaadin-context-menu theme="foo"></vaadin-context-menu>');
    await nextRender();
  });

  it('should propagate theme attribute to overlay', () => {
    expect(menu._overlayElement.getAttribute('theme')).to.equal('foo');
  });
});
