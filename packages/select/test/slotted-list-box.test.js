import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-select.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';
import { clearWarnings } from '@vaadin/component-base/src/warnings.js';

describe('slotted list-box', () => {
  let select, overlay, listBox, valueButton;

  beforeEach(async () => {
    select = fixtureSync(`
      <vaadin-select value="bar">
        <vaadin-select-list-box slot="overlay">
          <vaadin-select-item value="foo">Foo</vaadin-select-item>
          <vaadin-select-item value="bar">Bar</vaadin-select-item>
          <vaadin-select-item value="baz">Baz</vaadin-select-item>
        </vaadin-select-list-box>
      </vaadin-select>
    `);
    await nextRender();
    overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    listBox = select.querySelector('vaadin-select-list-box');
    valueButton = select.querySelector('vaadin-select-value-button');
  });

  it('should use the slotted list-box as the menu element and populate items', () => {
    expect(select._menuElement).to.equal(listBox);
    expect(listBox.items).to.have.lengthOf(3);
    expect(select._items).to.equal(listBox.items);
  });

  it('should select the item matching the initial value', () => {
    expect(select.value).to.equal('bar');
    expect(listBox.selected).to.equal(1);
  });

  it('should select the matching item and update the value button on value change', async () => {
    select.value = 'baz';
    await nextUpdate(select);
    expect(listBox.selected).to.equal(2);
    expect(valueButton.textContent.trim()).to.equal('Baz');
  });

  it('should reflect dynamically added and removed slotted items', async () => {
    const item = document.createElement('vaadin-select-item');
    item.value = 'qux';
    item.textContent = 'Qux';
    listBox.appendChild(item);
    await nextRender();
    expect(listBox.items).to.have.lengthOf(4);

    select.value = 'qux';
    await nextUpdate(select);
    expect(listBox.selected).to.equal(3);

    listBox.removeChild(listBox.items[0]);
    await nextRender();
    expect(select._items).to.have.lengthOf(3);
  });

  it('should clear the selected index when the selected item is removed', async () => {
    expect(listBox.selected).to.equal(1);

    listBox.removeChild(listBox.items[1]);
    await nextRender();

    expect(listBox.selected).to.not.exist;
  });

  it('should restore focus to the value button on close', async () => {
    select.focus();
    select.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');

    await sendKeys({ press: 'Escape' });
    await nextRender();

    expect(getDeepActiveElement()).to.equal(valueButton);
  });

  it('should clear the menu element and items when the slotted list-box is removed', async () => {
    select.removeChild(listBox);
    await nextRender();

    expect(select._menuElement).to.be.null;
    expect(select._items).to.be.null;

    // Do not apply matching value after removing.
    select.value = 'baz';
    await nextUpdate(select);
    expect(valueButton.textContent.trim()).to.not.equal('Baz');
  });
});

describe('lazy list-box', () => {
  it('should use the list-box added lazily and apply the pre-set value', async () => {
    const select = fixtureSync('<vaadin-select></vaadin-select>');
    select.value = 'bar';
    await nextRender();

    const listBox = document.createElement('vaadin-select-list-box');
    ['foo', 'bar', 'baz'].forEach((value) => {
      const item = document.createElement('vaadin-select-item');
      item.value = value;
      item.textContent = value;
      listBox.appendChild(item);
    });
    listBox.setAttribute('slot', 'overlay');
    select.appendChild(listBox);
    await nextRender();

    expect(select._menuElement).to.equal(listBox);
    expect(listBox.selected).to.equal(1);
  });
});

describe('slotted list-box with items and renderer', () => {
  let select, listBox, warnSpy;

  beforeEach(() => {
    clearWarnings();
    warnSpy = sinon.stub(console, 'warn');
    select = fixtureSync(`
      <vaadin-select>
        <vaadin-select-list-box slot="overlay">
          <vaadin-select-item value="foo">Foo</vaadin-select-item>
          <vaadin-select-item value="bar">Bar</vaadin-select-item>
        </vaadin-select-list-box>
      </vaadin-select>
    `);
    listBox = select.querySelector('vaadin-select-list-box');
  });

  afterEach(() => {
    warnSpy.restore();
  });

  it('should use the slotted list-box over the items property and warn once', async () => {
    select.items = [{ label: 'Ignored', value: 'ignored' }];
    await nextRender();

    expect(select._menuElement).to.equal(listBox);
    expect(listBox.items).to.have.lengthOf(2);
    expect(warnSpy.callCount).to.equal(1);
  });

  it('should use the slotted list-box over the renderer and warn once', async () => {
    select.renderer = (root) => {
      root.textContent = 'Renderer';
    };
    await nextRender();

    expect(select._menuElement).to.equal(listBox);
    expect(warnSpy.callCount).to.equal(1);
  });
});
