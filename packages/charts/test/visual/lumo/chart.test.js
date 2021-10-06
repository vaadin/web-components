import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../vaadin-chart.js';

describe('chart', () => {
  let element;

  beforeEach(() => {
    element = fixtureSync('<vaadin-chart title="The chart title"></vaadin-chart>');
  });

  it('empty with title', async () => {
    await visualDiff(element, 'empty-title');
  });
});
