import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/aura/aura.css';

describe('table', () => {
  let wrapper, table;

  beforeEach(() => {
    wrapper = fixtureSync(`
      <div style="display: inline-block; padding: 10px">
        <table>
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
    table = wrapper.querySelector('table');
  });

  it('default', async () => {
    wrapper.classList.add('vaadin-themed-html');
    await visualDiff(wrapper, 'table-default');
  });

  it('class on the table', async () => {
    table.classList.add('vaadin-themed-html');
    await visualDiff(wrapper, 'table-class-on-table');
  });

  it('without the class', async () => {
    await visualDiff(wrapper, 'table-without-class');
  });

  it('opted out', async () => {
    wrapper.classList.add('vaadin-themed-html');
    table.classList.add('vaadin-unthemed-html');
    await visualDiff(wrapper, 'table-opted-out');
  });
});
