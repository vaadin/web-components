import { aTimeout, fixtureSync, nextFrame } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/charts.css';
import '../../chart-not-animated-styles.js';
import '../../../vaadin-chart.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import { cleanupExport, prepareExport } from '../../../src/helpers.js';

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

    it('pie-gradient', async () => {
      element.setAttribute('theme', 'gradient');
      await visualDiff(element, 'pie-gradient');
    });

    it('pie-monotone', async () => {
      element.setAttribute('theme', 'monotone');
      await visualDiff(element, 'pie-monotone');
    });

    it('pie-classic', async () => {
      element.setAttribute('theme', 'classic');
      await visualDiff(element, 'pie-classic');
    });
  });

  describe('exporting', () => {
    let exporting;
    beforeEach(async () => {
      const fixture = fixtureSync(`
        <div>
          <vaadin-chart
            hidden
            title="Solar Employment Growth by Sector, 2010-2016"
            categories="[2010, 2011, 2012, 2013, 2014, 2015, 206, 2017]"
            additional-options='{
              "plotOptions": {
                "series": {
                  "animation": false
                }
              }
            }'
          >
            <vaadin-chart-series
              title="Installation"
              values="[43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]"
            ></vaadin-chart-series>
            <vaadin-chart-series
              title="Manufacturing"
              values="[24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]"
            ></vaadin-chart-series>
            <vaadin-chart-series
              title="Sales &amp; Distribution"
              values="[11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]"
            ></vaadin-chart-series>
            <vaadin-chart-series
              title="Project Development"
              values="[null, null, 7988, 12169, 15112, 22452, 34400, 34227]"
            ></vaadin-chart-series>
            <vaadin-chart-series
              title="Other"
              values="[12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]"
            ></vaadin-chart-series>
          </vaadin-chart>
          <div id="exporting" style="margin: 2em;"></div>
        </div>
      `);
      element = fixture.querySelector('vaadin-chart');
      exporting = fixture.querySelector('#exporting');

      await nextFrame();

      Highcharts.chart(exporting, element.configuration.userOptions);
      prepareExport(element);

      await aTimeout(500);
    });

    afterEach(() => {
      cleanupExport(element);
    });

    it('styled mode', async () => {
      await visualDiff(exporting, 'styled-mode');
    });
  });
});
