import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../src/props/index.css';
import '../../src/global/index.css';

function fixtureTable(className) {
  return fixtureSync(`
    <div style="display: inline-block; padding: 10px">
      <table class="${className}">
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
    await visualDiff(fixtureTable('vaadin-default'), 'table-default');
  });

  it('without the class', async () => {
    await visualDiff(fixtureTable(''), 'table-without-class');
  });

  it('no header row', async () => {
    const wrapper = fixtureSync(`
      <div style="display: inline-block; padding: 10px">
        <table class="vaadin-default">
          <tbody>
            <tr>
              <th scope="row">Mercury</th>
              <td>4,879</td>
            </tr>
            <tr>
              <th scope="row">Earth</th>
              <td>12,756</td>
            </tr>
          </tbody>
        </table>
      </div>
    `);

    await visualDiff(wrapper, 'table-no-header-row');
  });
});
