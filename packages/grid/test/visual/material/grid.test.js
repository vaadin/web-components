import { click, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '../../../theme/material/vaadin-grid.js';
import '../../../theme/material/vaadin-grid-column-group.js';
import '../../../theme/material/vaadin-grid-sorter.js';
import '../../../theme/material/vaadin-grid-tree-column.js';
import { flushGrid } from '../../helpers.js';
import { users } from '../users.js';

describe('grid', () => {
  let element;

  ['ltr', 'rtl'].forEach((dir) => {
    describe(dir, () => {
      before(() => {
        document.documentElement.setAttribute('dir', dir);
      });

      after(() => {
        document.documentElement.removeAttribute('dir');
      });

      describe('header and footer', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid size="200" style="width: 200px; height: 100px">
              <template class="row-details">[[index]]</template>
              <vaadin-grid-column>
                <template class="header">header</template>
                <template>[[index]]</template>
                <template class="footer">footer</template>
              </vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        it('header footer', async () => {
          await visualDiff(element, `${dir}-header-footer`);
        });
      });

      describe('column groups', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid style="height: 250px" column-reordering-allowed>
              <vaadin-grid-column width="30px" flex-grow="0" resizable>
                <template class="header">#</template>
                <template>[[index]]</template>
              </vaadin-grid-column>

              <vaadin-grid-column-group resizable>
                <template class="header">Name</template>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">First</template>
                  <template>[[item.name.first]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">Last</template>
                  <template>[[item.name.last]]</template>
                </vaadin-grid-column>
              </vaadin-grid-column-group>

              <vaadin-grid-column-group resizable>
                <template class="header">Location</template>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">City</template>
                  <template>[[item.location.city]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="calc(20% - 50px)">
                  <template class="header">State</template>
                  <template>[[item.location.state]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column width="200px" resizable>
                  <template class="header">Street</template>
                  <template>[[item.location.street]]</template>
                </vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        it('column groups', async () => {
          await visualDiff(element, `${dir}-column-groups`);
        });
      });

      describe('row details', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid>
              <template class="row-details">
                <div class="details-cell">
                  <h1>Hi, I'm [[item.name.first]]</h1>
                </div>
              </template>

              <vaadin-grid-column-group>
                <template class="header">
                  <div class="header-content">
                    <b>1-200 of 15,554</b>
                    <input placeholder="Search profiles" focus-target />
                  </div>
                </template>

                <vaadin-grid-column width="55px" flex-grow="0">
                  <template>
                    <input type="checkbox" checked="{{selected::change}}" />
                  </template>
                </vaadin-grid-column>

                <vaadin-grid-column resizable>
                  <template class="header">Email</template>
                  <template>[[item.email]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column>
                  <template class="header">City</template>
                  <template>[[item.location.city]]</template>
                </vaadin-grid-column>

                <vaadin-grid-column>
                  <template class="header">State</template>
                  <template>[[item.location.state]]</template>
                </vaadin-grid-column>
              </vaadin-grid-column-group>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
        });

        it('row details', async () => {
          element.openItemDetails(element.items[0]);
          await visualDiff(element, `${dir}-row-details`);
        });
      });

      describe('sorting', () => {
        let firstSorter, secondSorter;

        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid style="height: 250px" multi-sort>
              <vaadin-grid-column width="50px">
                <template class="header">#</template>
                <template>[[index]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">
                  <vaadin-grid-sorter id="first-name-sorter" path="name.first">First name</vaadin-grid-sorter>
                </template>
                <template>[[item.name.first]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">
                  <vaadin-grid-sorter id="last-name-sorter" path="name.last">Last name</vaadin-grid-sorter>
                </template>
                <template>[[item.name.last]]</template>
              </vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);
          await nextRender(element);
          firstSorter = document.querySelector('#first-name-sorter');
          secondSorter = document.querySelector('#last-name-sorter');
        });

        it('initial', async () => {
          await visualDiff(element, `${dir}-sorting-initial`);
        });

        it('single asc', async () => {
          click(firstSorter);
          await visualDiff(element, `${dir}-sorting-single-asc`);
        });

        it('multi asc asc', async () => {
          click(firstSorter);
          click(secondSorter);
          await visualDiff(element, `${dir}-sorting-multi-asc-asc`);
        });

        it('multi asc desc', async () => {
          click(firstSorter);
          click(secondSorter);
          click(secondSorter);
          await visualDiff(element, `${dir}-sorting-multi-asc-desc`);
        });

        it('single desc', async () => {
          click(firstSorter);
          click(firstSorter);
          await visualDiff(element, `${dir}-sorting-single-desc`);
        });
      });

      describe('row focus', () => {
        beforeEach(async () => {
          element = fixtureSync(`
            <vaadin-grid style="width: 550px">
              <vaadin-grid-column-group header="Name" frozen>
                <vaadin-grid-column path="name.first" width="200px" flex-shrink="0"></vaadin-grid-column>
                <vaadin-grid-column path="name.last" width="200px" flex-shrink="0"></vaadin-grid-column>
              </vaadin-grid-column-group>
              <vaadin-grid-column path="location.city" width="200px" flex-shrink="0"></vaadin-grid-column>
            </vaadin-grid>
          `);
          element.items = users;
          flushGrid(element);

          // Scroll all the way to end
          element.$.table.scrollLeft = element.__isRTL ? -1000 : 1000;

          // Focus a header row
          await sendKeys({ press: 'Tab' });
          // Switch to row focus mode
          await sendKeys({ press: element.__isRTL ? 'ArrowRight' : 'ArrowLeft' });
          // Tab to body row
          await sendKeys({ press: 'Tab' });

          await nextRender(element);
        });

        it('row focus', async () => {
          await visualDiff(element, `${dir}-row-focus`);
        });

        it('row focus - header', async () => {
          // Focus a header row
          element.tabIndex = 0;
          element.focus();
          await sendKeys({ press: 'Tab' });

          await visualDiff(element, `${dir}-row-focus-header`);
        });
      });
    });
  });

  describe('drag and drop', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid drop-mode="on-top-or-between" rows-draggable>
          <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
          <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
          <vaadin-grid-column path="email"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.rowDetailsRenderer = (root) => {
        root.innerHTML = '<p>Details</p>';
      };
      element.items = users;
      flushGrid(element);
      await nextRender(element);
    });

    it('dragover', async () => {
      element.setAttribute('dragover', '');
      await visualDiff(element, 'dragover');
    });

    it('dragover on top', async () => {
      element.$.items.children[1].setAttribute('dragover', 'on-top');
      await visualDiff(element, 'row-dragover-on-top');
    });

    it('dragover above', async () => {
      element.$.items.children[1].setAttribute('dragover', 'above');
      await visualDiff(element, 'row-dragover-above');
    });

    it('dragover below', async () => {
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, 'row-dragover-below');
    });

    it('dragover above details', async () => {
      element.detailsOpenedItems = [element.items[1]];
      element.$.items.children[1].setAttribute('dragover', 'above');
      await visualDiff(element, 'row-dragover-above-details');
    });

    it('dragover below details', async () => {
      element.detailsOpenedItems = [element.items[1]];
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, 'row-dragover-below-details');
    });

    it('dragover row dragstart', async () => {
      element.$.items.children[1].setAttribute('dragstart', '123');
      await visualDiff(element, 'row-dragstart');
    });

    it('dragover below last row with all rows visible', async () => {
      element.allRowsVisible = true;
      element.items = element.items.slice(0, 2);
      element.$.items.children[1].setAttribute('dragover', 'below');
      await visualDiff(element, 'dragover-below-last-row-all-rows-visible');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid>
          <vaadin-grid-column path="name.first" header="First name"></vaadin-grid-column>
          <vaadin-grid-column path="name.last" header="Last name"></vaadin-grid-column>
          <vaadin-grid-column path="email"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.items = users;
      flushGrid(element);
      await nextRender(element);
    });

    it('disabled', async () => {
      element.disabled = true;
      await visualDiff(element, 'disabled');
    });
  });

  describe('tree', () => {
    beforeEach(async () => {
      element = fixtureSync(`
        <vaadin-grid item-id-path="name">
          <vaadin-grid-tree-column path="name" width="200px" flex-shrink="0"></vaadin-grid-tree-column>
          <vaadin-grid-column path="name" width="200px" flex-shrink="0"></vaadin-grid-column>
        </vaadin-grid>
      `);
      element.dataProvider = ({ parentItem, page, pageSize }, cb) => {
        // Let's have 10 root-level items and 3 items on every child level
        const levelSize = parentItem ? 3 : 10;

        const pageItems = [...Array(Math.min(levelSize, pageSize))].map((_, i) => {
          const indexInLevel = page * pageSize + i;

          return {
            name: `Very long grid item name ${parentItem ? parentItem.name + '-' : ''}${indexInLevel}`,
            children: true,
          };
        });

        cb(pageItems, levelSize);
      };
      flushGrid(element);
      await nextRender(element);
    });

    it('default', async () => {
      await visualDiff(element, 'tree-default');
    });

    it('overflow', async () => {
      element.style.maxWidth = '400px';
      await visualDiff(element, 'tree-overflow');
    });
  });
});
