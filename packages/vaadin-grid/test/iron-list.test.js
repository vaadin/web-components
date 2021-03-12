import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { fixtureSync } from '@open-wc/testing-helpers';
import { flushGrid, infiniteDataProvider } from './helpers.js';
import '@polymer/iron-list/iron-list.js';
import '../vaadin-grid.js';

describe('iron list', () => {
  let wrapper, grid, ironList;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div>
        <vaadin-grid style="width: 200px; height: 200px;" size="1000">
          <vaadin-grid-column>
            <template>[[index]]</template>
          </vaadin-grid-column>
        </vaadin-grid>
        <iron-list></iron-list>
      </div>
    `);
    grid = wrapper.children[0];
    ironList = wrapper.children[1];
    grid.dataProvider = infiniteDataProvider;
    flushGrid(grid);
  });

  it('should work with another iron-list on the page', () => {
    expect(grid.$ && ironList.is).to.equal('iron-list');
  });

  it('should warn when using iron-list APIs trough grid', () => {
    grid._debouncerWarnPrivateAPIAccess && grid._debouncerWarnPrivateAPIAccess.flush();
    sinon.stub(console, 'warn');
    grid.firstVisibleIndex;
    expect(console.warn.callCount).to.equal(1);
    console.warn.restore();
  });
});
