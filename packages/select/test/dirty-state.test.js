import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import '../src/vaadin-select.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('dirty state', () => {
  let select, menu, valueButton;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select></vaadin-select>');
    select.items = [
      { label: 'Item 1', value: 'item-1' },
      { label: 'Item 2', value: 'item-2' },
    ];
    menu = select._menuElement;
    valueButton = select.querySelector('vaadin-select-value-button');
  });

  it('should not be dirty by default', () => {
    expect(select.dirty).to.be.false;
  });

  it('should not be dirty after blur without change', () => {
    select.focus();
    select.blur();
    expect(select.dirty).to.be.false;
  });

  it('should not be dirty after outside click without change', async () => {
    select.focus();
    select.click();
    outsideClick();
    expect(select.dirty).to.be.false;
  });

  it('should be dirty after selecting a menu item with click', async () => {
    select.focus();
    select.click();
    await nextRender();
    const menuItem = getDeepActiveElement();
    menuItem.click();
    expect(select.dirty).to.be.true;
  });

  it('should be dirty after selecting a menu item with Enter', async () => {
    select.focus();
    select.click();
    await nextRender();
    await sendKeys({ press: 'Enter' });
    expect(select.dirty).to.be.true;
  });

  it('should fire dirty-changed event when the state changes', () => {
    const spy = sinon.spy();
    select.addEventListener('dirty-changed', spy);
    select.dirty = true;
    expect(spy.calledOnce).to.be.true;
  });
});
