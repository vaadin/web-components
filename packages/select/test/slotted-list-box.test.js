import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, nextRender, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-select.js';

describe('slotted list-box', () => {
  let select, overlay, listBox, valueButton;

  beforeEach(async () => {
    select = fixtureSync(`
      <vaadin-select>
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

  it('should use the slotted list-box as the menu element', () => {
    expect(select._menuElement).to.equal(listBox);
  });

  it('should populate items from the slotted list-box', () => {
    expect(listBox.items).to.have.lengthOf(3);
    expect(select._items).to.equal(listBox.items);
  });

  it('should render the slotted items when the overlay is opened', async () => {
    select.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
    expect(overlay.opened).to.be.true;
    expect(listBox.isConnected).to.be.true;
    expect(listBox.items).to.have.lengthOf(3);
  });

  it('should select the matching item when setting the value', async () => {
    select.value = 'bar';
    await nextUpdate(select);
    expect(listBox.selected).to.equal(1);
  });

  it('should update the value button when setting the value', async () => {
    select.value = 'baz';
    await nextUpdate(select);
    expect(valueButton.textContent.trim()).to.equal('Baz');
  });

  it('should select the item matching the initial value', async () => {
    const other = fixtureSync(`
      <vaadin-select value="bar">
        <vaadin-select-list-box slot="overlay">
          <vaadin-select-item value="foo">Foo</vaadin-select-item>
          <vaadin-select-item value="bar">Bar</vaadin-select-item>
        </vaadin-select-list-box>
      </vaadin-select>
    `);
    await nextRender();
    const otherListBox = other.querySelector('vaadin-select-list-box');
    expect(otherListBox.selected).to.equal(1);
    expect(other.value).to.equal('bar');
  });

  it('should update the value and close on item click', async () => {
    select.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');

    const changeSpy = sinon.spy();
    select.addEventListener('change', changeSpy);

    listBox.items[2].click();
    await nextUpdate(select);

    expect(select.value).to.equal('baz');
    expect(select.opened).to.be.false;
    expect(changeSpy.calledOnce).to.be.true;
  });

  it('should update selection when adding a slotted item dynamically', async () => {
    const item = document.createElement('vaadin-select-item');
    item.value = 'qux';
    item.textContent = 'Qux';
    listBox.appendChild(item);
    await nextRender();

    expect(listBox.items).to.have.lengthOf(4);

    select.value = 'qux';
    await nextUpdate(select);
    expect(listBox.selected).to.equal(3);
    expect(valueButton.textContent.trim()).to.equal('Qux');
  });

  it('should update items when removing a slotted item dynamically', async () => {
    listBox.removeChild(listBox.items[0]);
    await nextRender();

    expect(listBox.items).to.have.lengthOf(2);
    expect(select._items).to.have.lengthOf(2);
  });

  it('should select an item with the first-letter keyboard shortcut', async () => {
    select.focusElement.focus();
    await sendKeys({ press: 'B' });
    await nextUpdate(select);

    expect(select.value).to.equal('bar');
  });

  it('should not open when readonly', async () => {
    select.readonly = true;
    await nextUpdate(select);
    select.opened = true;
    await nextUpdate(select);
    expect(select.opened).to.be.false;
  });

  it('should not open when disabled', async () => {
    select.disabled = true;
    await nextUpdate(select);
    select.opened = true;
    await nextUpdate(select);
    expect(select.opened).to.be.false;
  });
});

describe('slotted list-box with items and renderer', () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = sinon.stub(console, 'warn');
  });

  afterEach(() => {
    warnSpy.restore();
  });

  it('should use the slotted list-box over the items property and warn once', async () => {
    const select = fixtureSync(`
      <vaadin-select>
        <vaadin-select-list-box slot="overlay">
          <vaadin-select-item value="foo">Foo</vaadin-select-item>
          <vaadin-select-item value="bar">Bar</vaadin-select-item>
        </vaadin-select-list-box>
      </vaadin-select>
    `);
    select.items = [{ label: 'Ignored', value: 'ignored' }];
    await nextRender();

    const listBox = select.querySelector('vaadin-select-list-box');
    expect(select._menuElement).to.equal(listBox);
    expect(listBox.items).to.have.lengthOf(2);
    expect(warnSpy.callCount).to.equal(1);
  });

  it('should use the slotted list-box over the renderer and warn once', async () => {
    const select = fixtureSync(`
      <vaadin-select>
        <vaadin-select-list-box slot="overlay">
          <vaadin-select-item value="foo">Foo</vaadin-select-item>
        </vaadin-select-list-box>
      </vaadin-select>
    `);
    select.renderer = (root) => {
      root.textContent = 'Renderer';
    };
    await nextRender();

    const listBox = select.querySelector('vaadin-select-list-box');
    expect(select._menuElement).to.equal(listBox);
    expect(warnSpy.callCount).to.equal(1);
  });
});
