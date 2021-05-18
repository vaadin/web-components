import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';

import '../vaadin-template-renderer.js';

import './fixtures/mock-grid.js';
// import './fixtures/mock-grid-host.js';

describe('grid', () => {
  let grid;

  beforeEach(() => {
    grid = fixtureSync(`
      <mock-grid>
        <template class="body"></template>
        <template class="header"></template>
        <template class="footer"></template>
        <template class="row-details"></template>
      </mock-grid>
    `);
  });

  it('should set the body renderer', () => {
    const template = grid.querySelector('template.body');

    expect(grid.renderer).to.be.ok;
    expect(grid.renderer.__templatizer).to.be.equal(template.__templatizer);
  });

  it('should set the header renderer', () => {
    const template = grid.querySelector('template.header');

    expect(grid.headerRenderer).to.be.ok;
    expect(grid.headerRenderer.__templatizer).to.be.equal(template.__templatizer);
  });

  it('should set the footer renderer', () => {
    const template = grid.querySelector('template.footer');

    expect(grid.footerRenderer).to.be.ok;
    expect(grid.footerRenderer.__templatizer).to.be.equal(template.__templatizer);
  });

  it('should set the row details renderer', () => {
    const template = grid.querySelector('template.row-details');

    expect(grid.rowDetailsRenderer).to.be.ok;
    expect(grid.rowDetailsRenderer.__templatizer).to.be.equal(template.__templatizer);
  });
});

// describe('grid', () => {
//   let host, grid;

//   function getCell(row, index = 0) {
//     return row.querySelectorAll('[part~="cell"]')[index];
//   }

//   beforeEach(async () => {
//     host = fixtureSync(`
//       <mock-grid-host>
//         <template class="header" slot="header-template">header</template>
//         <template class="footer" slot="footer-template">footer</template>
//         <template class="content" slot="content-template">content</template>
//       </mock-grid-host>
//     `);
//     grid = host.$.grid;

//     await nextRender(grid);
//   });

//   ['header', 'footer'].forEach((templateName) => {
//     describe(`${templateName} template`, () => {
//       let cell;

//       beforeEach(() => {
//         cell = getCell(grid.$[templateName], 0);
//       });

//       it(`should process the ${templateName} template`, () => {
//         const template = grid.querySelector(`template.${templateName}`);
//         const templatizer = template.__templatizer;

//         expect(templatizer).to.be.an.instanceof(Templatizer);
//         expect(templatizer.__templateInstances).to.have.lengthOf(1);
//         expect(templatizer.__templateInstances).to.include(cell._content.__templateInstance);
//       });

//       it(`should render the ${templateName} template`, () => {
//         expect(cell._content.textContent).to.equal(templateName);
//       });
//     });
//   });

//   describe('content template', () => {
//     it('should process the content template', () => {
//       const cell = getCell(grid.$.items.children[0], 0);

//       const template = grid.querySelector('template.content');
//       const templatizer = template.__templatizer;

//       expect(templatizer).to.be.an.instanceof(Templatizer);
//       expect(templatizer.__templateInstances).to.have.lengthOf(2);
//       expect(templatizer.__templateInstances).to.include(cell._content.__templateInstance);
//     });

//     it('should render cells using the content template', () => {
//       const items = grid.$.items.children;

//       expect(items).to.have.lengthOf(2);
//       expect(getCell(items[0], 0)._content.textContent).to.equal('item1');
//       expect(getCell(items[1], 0)._content.textContent).to.equal('item2');
//     });
//   });

//   // describe('when using slots', () => {

//   // });
// });
