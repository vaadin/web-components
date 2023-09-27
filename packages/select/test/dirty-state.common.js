import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender, nextUpdate, outsideClick } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('dirty state', () => {
  let select;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select></vaadin-select>');
    select.items = [
      { label: 'Item 1', value: 'item-1' },
      { label: 'Item 2', value: 'item-2' },
    ];
    await nextRender();
  });

  it('should not be dirty by default', () => {
    expect(select.dirty).to.be.false;
  });

  it('should not be dirty after programmatic value change', async () => {
    select.value = 'item-1';
    await nextUpdate(select);
    expect(select.dirty).to.be.false;
  });

  it('should not be dirty after blur without change', () => {
    select.focus();
    select.blur();
    expect(select.dirty).to.be.false;
  });

  it('should not be dirty after outside click without change', () => {
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
    await nextUpdate(select._menuElement);
    await nextUpdate(select);
    expect(select.dirty).to.be.true;
  });

  it('should be dirty after selecting a menu item with Enter', async () => {
    select.focus();
    select.click();
    await nextRender();
    await sendKeys({ press: 'Enter' });
    await nextUpdate(select._menuElement);
    await nextUpdate(select);
    expect(select.dirty).to.be.true;
  });

  it('should fire dirty-changed event when the state changes', async () => {
    const spy = sinon.spy();
    select.addEventListener('dirty-changed', spy);
    select.dirty = true;
    await nextUpdate(select);
    expect(spy.calledOnce).to.be.true;
  });
});
