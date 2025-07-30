import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../src/vaadin-chart.js';

describe('chart', () => {
  let element;

  describe('empty', () => {
    beforeEach(() => {
      element = fixtureSync('<vaadin-chart title="The chart title"></vaadin-chart>');
    });

    it('empty with title', async () => {
      await visualDiff(element, 'empty-title');
    });
  });

  describe('pie', () => {
    beforeEach(() => {
      element = fixtureSync(`
        <vaadin-chart
          type="pie"
          additional-options='{
            "plotOptions": {
              "series": {
                "animation": false
              }
            }
          }'
        >
          <vaadin-chart-series
            title="Brands"
            values='[
              {
                "name": "Chrome",
                "y": 70.7
              },
              {
                "name": "Safari",
                "y": 8.9
              },
              {
                "name": "Firefox",
                "y": 7.7
              },
              {
                "name": "Edge",
                "y": 5.8
              },
              {
                "name": "IE",
                "y": 2.1
              },
              {
                "name": "QQ",
                "y": 2
              },
              {
                "name": "Sogou Explorer",
                "y": 1.8
              },
              {
                "name": "Yandex",
                "y": 0.9
              },
              {
                "name": "Brave",
                "y": 0.1
              }
            ]'
          ></vaadin-chart-series>
        </vaadin-chart>
      `);
    });

    it('pie', async () => {
      await visualDiff(element, 'pie');
    });

    it('pie-dark', async () => {
      document.documentElement.style.setProperty('color-scheme', 'dark');
      await visualDiff(element, 'pie-dark');
    });
  });
});
