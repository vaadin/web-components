import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '@vaadin/date-picker';
import '@vaadin/virtual-list';
describe('date-picker in virtual-list', () => {
  let list;

  beforeEach(async () => {
    list = fixtureSync(`<vaadin-virtual-list selection-mode="multi"></vaadin-virtual-list>`);
    list.items = ['foo', 'bar'];
    list.renderer = (root, _list) => {
      if (!root.firstElementChild) {
        root.innerHTML = `<vaadin-date-picker></vaadin-date-picker>`;
      }
    };
    await nextRender();
  });

  it('should not navigate the virtual list items on date picker arrow keys', async () => {
    const [firstDatePicker] = list.querySelectorAll('vaadin-date-picker');
    firstDatePicker.focus();
    expect(firstDatePicker.parentElement.hasAttribute('focused')).to.be.true;

    // Select a value for the date picker using arrow keys
    await sendKeys({ press: 'Space' });
    await sendKeys({ press: 'ArrowDown' });
    await sendKeys({ press: 'Space' });
    await sendKeys({ press: 'Enter' });

    // Expect the keyboard interaction to not navigate nor select the virtual list items
    expect(list.selectedItems).to.be.empty;
    expect(firstDatePicker.parentElement.hasAttribute('focused')).to.be.true;
  });
});
