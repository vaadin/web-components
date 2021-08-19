import { fixtureSync } from '@vaadin/testing-helpers/dist/fixture.js';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../vaadin-chart.js';

describe('chart', () => {
  it('empty with title', async () => {
    const element = fixtureSync('<vaadin-chart title="The chart title"></vaadin-chart>');
    await visualDiff(element, `${import.meta.url}_empty-title`);
  });

  it('should update when container width changes', (done) => {
    const element = fixtureSync(`
      <div>
        <style>
          .root {
            display: flex;
            width: 100%;
          }
          .box {
            min-width: 50%;
          }
          .chart-container {
            flex-grow: 1;
          }
          .hidden {
            display: none !important;
          }
        </style>
        <div class="root">
          <div class="box hidden"></div>
          <div class="chart-container">
            <vaadin-chart
              type="line"
              categories="[1750, 1800]"
              stacking="normal"
              no-legend
              no-tooltip
            >
              <vaadin-chart-series title="Asia" values="[502, 635]"></vaadin-chart-series>
            </vaadin-chart>
          </div>
        </div>
      </div>
    `);

    const chart = element.querySelector('vaadin-chart');
    const box = element.querySelector('.box');

    chart.additionalOptions = {
      chart: {
        animation: false,
        events: {
          load() {
            setTimeout(() => {
              box.classList.toggle('hidden');
              chart.__reflow();
              setTimeout(async () => {
                await visualDiff(element, `${import.meta.url}_responsive`);
                done();
              });
            });
          }
        }
      },
      plotOptions: {
        series: {
          animation: {
            duration: 0
          }
        }
      },
      drilldown: {
        animation: {
          duration: 0
        }
      }
    };
  });
});
