import { expect } from '@vaadin/chai-plugins';
import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync, mouseup, oneEvent } from '@vaadin/testing-helpers';
import './chart-not-animated-styles.js';
import '../src/vaadin-chart.js';

function focusedPointIndex(chart) {
  return chart.configuration.highlightedPoint?.index;
}

describe('vaadin-chart accessibility', () => {
  let chart;

  beforeEach(async () => {
    chart = fixtureSync(`
      <vaadin-chart title="Sales">
        <vaadin-chart-series title="Installation" values="[19, 12, 9, 24, 5]"></vaadin-chart-series>
        <vaadin-chart-series title="Manufacturing" values="[3, 8, 14, 2, 20]"></vaadin-chart-series>
      </vaadin-chart>
    `);
    await oneEvent(chart, 'chart-load');
    chart.shadowRoot.querySelector('.highcharts-a11y-proxy-element').focus();
  });

  describe('screen reader', () => {
    it('should render the accessibility proxy elements inside the shadow root', () => {
      expect(chart.shadowRoot.querySelector('.highcharts-a11y-proxy-container-before')).to.exist;
      expect(chart.shadowRoot.querySelector('.highcharts-a11y-proxy-container-after')).to.exist;
    });

    it('should name every point after its value and series', () => {
      const points = chart.configuration.series.flatMap((series) => series.points);
      expect(points).to.have.lengthOf(10);
      points.forEach((point) => {
        expect(point.graphic.element.getAttribute('aria-label')).to.be.a('string').and.not.be.empty;
      });
      expect(points[0].graphic.element.getAttribute('aria-label')).to.contain('19').and.to.contain('Installation');
    });
  });

  describe('keyboard navigation', () => {
    it('should move to the next point on each arrow press', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(focusedPointIndex(chart)).to.equal(0);
      await sendKeys({ press: 'ArrowRight' });
      expect(focusedPointIndex(chart)).to.equal(1);
    });

    it('should draw a focus border around the focused point', async () => {
      await sendKeys({ press: 'ArrowRight' });
      expect(chart.shadowRoot.querySelector('.highcharts-focus-border')).to.exist;
    });

    // On a document listener the event target is the <vaadin-chart> host, so without
    // the composed path every mouse release would look like an outside one.
    // Workaround for https://github.com/highcharts/highcharts/issues/23490
    describe('pointer release', () => {
      beforeEach(async () => {
        await sendKeys({ press: 'ArrowRight' });
        await sendKeys({ press: 'ArrowRight' });
        expect(focusedPointIndex(chart)).to.equal(1);
      });

      it('should restart navigation when released outside the chart', async () => {
        mouseup(document.body);
        expect(chart.configuration.focusElement).to.not.exist;

        await sendKeys({ press: 'ArrowRight' });
        expect(focusedPointIndex(chart)).to.equal(0);
      });

      it('should continue navigation when released on the chart', async () => {
        mouseup(chart.configuration.container);

        await sendKeys({ press: 'ArrowRight' });
        expect(focusedPointIndex(chart)).to.equal(2);
      });
    });
  });
});
