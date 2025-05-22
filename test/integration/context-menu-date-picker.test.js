import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/context-menu/src/vaadin-context-menu.js';
import '@vaadin/date-picker/src/vaadin-date-picker.js';
import { isTouch } from '@vaadin/component-base/src/browser-utils';
import { getMenuItems, openMenu } from '@vaadin/context-menu/test/helpers';
import { getFocusableCell, open } from '@vaadin/date-picker/test/helpers';

describe('date picker in context menu', () => {
  let menu;

  beforeEach(async () => {
    menu = fixtureSync(`
      <vaadin-context-menu>
        <button id="target"></button>
      </vaadin-context-menu>
    `);
    menu.openOn = isTouch ? 'click' : 'mouseover';
    const datePicker = document.createElement('vaadin-date-picker');
    menu.items = [{ component: datePicker }];
    await nextRender();
    const target = menu.firstElementChild;
    await openMenu(target);
  });

  it('should not close context menu on date click', async () => {
    const datePicker = getMenuItems(menu)[0];
    await open(datePicker);

    const date = getFocusableCell(datePicker);
    date.click();
    await nextFrame();

    expect(datePicker.opened).to.be.false;
    expect(menu.opened).to.be.true;
  });
});
