import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-board.js';

describe('board', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync(`
      <vaadin-board>
        <vaadin-board-row>
          <div>Cell 1</div>
          <div>Cell 2</div>
          <div>Cell 3</div>
          <div>Cell 4</div>
        </vaadin-board-row>
        <vaadin-board-row>
          <div>Cell 5</div>
          <div>Cell 6</div>
          <div>Cell 7</div>
        </vaadin-board-row>
        <vaadin-board-row>
          <div>Cell 8</div>
          <div>Cell 9</div>
        </vaadin-board-row>
        <vaadin-board-row>
          <div>Cell 10</div>
        </vaadin-board-row>
      </vaadin-board>
    `);
  });

  it('basic', async () => {
    await visualDiff(element, 'multiple-rows');
  });
});
