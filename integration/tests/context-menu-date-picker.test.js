import { expect } from '@esm-bundle/chai';
import { fire, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';
import '@vaadin/context-menu';
import '@vaadin/date-picker';
import { isTouch } from '@vaadin/component-base/src/browser-utils';
import { getFocusedCell, open } from '@vaadin/date-picker/test/helpers';

async function openMenu(target, event = isTouch ? 'click' : 'mouseover') {
  const menu = target.closest('vaadin-context-menu');
  if (menu) {
    menu.__openListenerActive = true;
  }
  const { right, bottom } = target.getBoundingClientRect();
  fire(target, event, { x: right, y: bottom });
  await nextRender();
}

function getMenuItems(menu) {
  return [...menu._overlayElement.querySelectorAll('[role="menu"] > :not([role="separator]"')];
}

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

    const date = getFocusedCell(datePicker._overlayContent);
    date.click();
    await nextFrame();

    expect(datePicker.opened).to.be.false;
    expect(menu.opened).to.be.true;
  });
});
