import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../src/vaadin-combo-box.js';
import { createRangeDataProvider } from '../src/vaadin-combo-box-range-data-provider.js';
import { makeItems } from './helpers.js';

const ITEMS = makeItems(1000);

describe('range data provider', () => {
  let comboBox;

  beforeEach(() => {
    comboBox = fixtureSync(`<vaadin-combo-box></vaadin-combo-box>`);
    comboBox.size = ITEMS.length;
    comboBox.dataProvider = createRangeDataProvider(
      ({ pageRange, pageSize }) => {

        ITEMS.slices()
      },
      {
        maxPageRange: 5,
      },
    );
  });
});
