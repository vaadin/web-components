import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { getAllItems } from './helpers.js';

describe('itemClassNameGenerator', () => {
  let comboBox;

  beforeEach(async () => {
    comboBox = fixtureSync('<vaadin-combo-box></vaadin-combo-box>');
    await nextRender();
    comboBox.items = ['foo', 'bar', 'baz'];
  });

  it('should set class name on dropdown items', async () => {
    comboBox.itemClassNameGenerator = (item) => `item-${item}`;
    comboBox.open();
    await nextRender();
    const items = getAllItems(comboBox);
    expect(items[0].className).to.equal('item-foo');
    expect(items[1].className).to.equal('item-bar');
    expect(items[2].className).to.equal('item-baz');
  });

  it('should remove class name when return value is empty string', async () => {
    comboBox.itemClassNameGenerator = (item) => `item-${item}`;
    comboBox.open();
    await nextRender();

    comboBox.close();
    comboBox.itemClassNameGenerator = () => '';

    comboBox.open();
    await nextRender();

    const items = getAllItems(comboBox);
    expect(items[0].className).to.equal('');
    expect(items[1].className).to.equal('');
    expect(items[2].className).to.equal('');
  });

  it('should remove class name when generator is set to null', async () => {
    comboBox.itemClassNameGenerator = (item) => `item-${item}`;
    comboBox.open();
    await nextRender();

    comboBox.close();
    comboBox.itemClassNameGenerator = null;

    comboBox.open();
    await nextRender();

    const items = getAllItems(comboBox);
    expect(items[0].className).to.equal('');
    expect(items[1].className).to.equal('');
    expect(items[2].className).to.equal('');
  });
});
