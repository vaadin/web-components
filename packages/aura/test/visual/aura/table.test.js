import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';

function fixtureTable({ wrapperClass = '', tableClass = '' } = {}) {
  return fixtureSync(`
    <div class="${wrapperClass}" style="display: inline-block; padding: 10px">
      <table class="${tableClass}">
        <caption>
          Planets of the inner solar system
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Diameter (km)</th>
            <th scope="col">Moons</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Mercury</th>
            <td>4,879</td>
            <td>0</td>
          </tr>
          <tr>
            <th scope="row">Earth</th>
            <td>12,756</td>
            <td>1</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>17,635</td>
            <td>1</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `);
}

describe('table', () => {
  it('default', async () => {
    await visualDiff(fixtureTable({ wrapperClass: 'vaadin-themed-html' }), 'table-default');
  });

  // Renders the same as 'default', and is here to keep the other half of the
  // selector — the class on the element itself — from going unnoticed
  it('class on the table', async () => {
    await visualDiff(fixtureTable({ tableClass: 'vaadin-themed-html' }), 'table-class-on-table');
  });

  it('without the class', async () => {
    await visualDiff(fixtureTable(), 'table-without-class');
  });
});
