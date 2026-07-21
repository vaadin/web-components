import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import '../src/vaadin-chart.js';

const PATTERN_PATH = 'M 0 0 L 10 10 M 9 -1 L 11 1 M -1 9 L 1 11';

describe('pattern fill', () => {
  let chart, chartContainer;

  function getDefsPatterns() {
    return Array.from(chartContainer.querySelectorAll('defs pattern'));
  }

  function getSeriesPoints(seriesIndex = 0) {
    const series = chartContainer.querySelectorAll('.highcharts-series')[seriesIndex];
    return Array.from(series.querySelectorAll('.highcharts-point'));
  }

  function getLegendSymbol(colorIndex = 0) {
    return chartContainer.querySelector(`.highcharts-legend-item.highcharts-color-${colorIndex}`);
  }

  function getPatternStyleText() {
    // The bridge appends its rules to a <style> on the element shadow root, not the chart container.
    const styleEl = chart.shadowRoot.querySelector('style[data-vaadin-pattern-fill]');
    return styleEl ? styleEl.textContent : '';
  }

  describe('series pattern color', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should render a pattern element in the chart defs', () => {
      expect(getDefsPatterns()).to.have.lengthOf(1);
    });

    it('should inject a pattern CSS rule into the shadow-root style element', () => {
      expect(getPatternStyleText()).to.contain('vaadin-pattern-');
    });

    it('should not set a fill attribute on the points (styled via CSS rule)', () => {
      getSeriesPoints().forEach((point) => {
        expect(point.getAttribute('fill') || '').to.not.contain('url(');
      });
    });

    it('should resolve the computed point fill to the pattern', () => {
      const patternId = getDefsPatterns()[0].getAttribute('id');
      const points = getSeriesPoints();
      expect(points).to.have.lengthOf(4);
      points.forEach((point) => {
        expect(getComputedStyle(point).fill).to.contain(patternId);
      });
    });

    it('should resolve the computed legend symbol fill to the pattern', () => {
      const patternId = getDefsPatterns()[0].getAttribute('id');
      const legendSymbol = getLegendSymbol();
      expect(legendSymbol).to.exist;
      expect(getComputedStyle(legendSymbol).fill).to.contain(patternId);
    });

    it('should apply the explicit pattern color to the pattern path', () => {
      const path = getDefsPatterns()[0].querySelector('path');
      expect(getComputedStyle(path).stroke).to.equal('rgb(255, 0, 0)');
    });
  });

  describe('non-styled mode', () => {
    // In non-styled mode Highcharts' own pattern-fill module renders patterns
    // natively; the Vaadin styled-mode bridge must stay out of the way.
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        chart: { styledMode: false },
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should render the pattern natively (highcharts-pattern def)', () => {
      const patterns = getDefsPatterns();
      expect(patterns.length).to.be.greaterThan(0);
      const ids = patterns.map((pattern) => pattern.getAttribute('id'));
      expect(ids.some((id) => id.startsWith('highcharts-pattern-'))).to.be.true;
    });

    it('should not create bridge defs or an injected stylesheet', () => {
      const ids = getDefsPatterns().map((pattern) => pattern.getAttribute('id'));
      expect(ids.some((id) => id.startsWith('vaadin-pattern-'))).to.be.false;
      expect(getPatternStyleText()).to.not.contain('vaadin-pattern-');
    });

    it('should keep the native fill on the points', () => {
      getSeriesPoints().forEach((point) => {
        expect(point.getAttribute('fill') || '').to.contain('url(');
        expect(getComputedStyle(point).fill).to.contain('url(');
      });
    });
  });

  describe('per-point pattern color', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [
              5,
              { y: 8, color: { pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#0000ff' } } },
              3,
              6,
            ],
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should render a pattern only for the point that defines it', () => {
      expect(getDefsPatterns()).to.have.lengthOf(1);
    });

    it('should use the inline-style fallback only on the configured point', () => {
      const patternId = getDefsPatterns()[0].getAttribute('id');
      const points = getSeriesPoints();
      // The differing point falls back to an inline fill style since a class-level
      // rule cannot distinguish points sharing the same color index.
      expect(points[1].style.fill).to.contain(`#${patternId}`);
      expect(points[0].style.fill || '').to.not.contain('url(');
      expect(points[2].style.fill || '').to.not.contain('url(');
    });

    it('should render the fallback point with the pattern fill', () => {
      const patternId = getDefsPatterns()[0].getAttribute('id');
      expect(getComputedStyle(getSeriesPoints()[1]).fill).to.contain(patternId);
    });

    it('should keep the non-patterned points on the theme color', () => {
      const points = getSeriesPoints();
      expect(getComputedStyle(points[0]).fill).to.not.contain('url(');
      expect(getComputedStyle(points[2]).fill).to.not.contain('url(');
    });

    it('should apply the point pattern color to the pattern path', () => {
      const path = getDefsPatterns()[0].querySelector('path');
      expect(getComputedStyle(path).stroke).to.equal('rgb(0, 0, 255)');
    });
  });

  describe('default pattern color', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.style.setProperty('--vaadin-charts-color-0', 'rgb(0, 255, 0)');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10 },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should follow the series color when no pattern color is set', () => {
      const path = getDefsPatterns()[0].querySelector('path');
      expect(getComputedStyle(path).stroke).to.equal('rgb(0, 255, 0)');
    });
  });

  describe('updateConfiguration', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should update the pattern without leaking defs', async () => {
      chart.updateConfiguration({
        series: [
          {
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#00ff00' },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');

      const patterns = getDefsPatterns();
      expect(patterns).to.have.lengthOf(1);
      expect(getComputedStyle(patterns[0].querySelector('path')).stroke).to.equal('rgb(0, 255, 0)');
      expect(getComputedStyle(getSeriesPoints()[0]).fill).to.contain(patterns[0].getAttribute('id'));
    });
  });

  describe('without patterns', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [{ data: [5, 8, 3, 6] }],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should not create any pattern defs', () => {
      expect(getDefsPatterns()).to.have.lengthOf(0);
    });

    it('should not inject any pattern CSS rules', () => {
      expect(getPatternStyleText()).to.not.contain('vaadin-pattern-');
    });

    it('should keep the theme color on points', () => {
      getSeriesPoints().forEach((point) => {
        expect(getComputedStyle(point).fill).to.not.contain('url(');
      });
    });
  });

  describe('multiple series with different patterns', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' },
            },
          },
          {
            data: [4, 2, 7, 1],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#0000ff' },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should render exactly two distinct pattern defs', () => {
      const patterns = getDefsPatterns();
      expect(patterns).to.have.lengthOf(2);
      const ids = patterns.map((pattern) => pattern.getAttribute('id'));
      expect(ids[0]).to.not.equal(ids[1]);
    });

    it('should resolve a different pattern fill for each series', () => {
      const firstFill = getComputedStyle(getSeriesPoints(0)[0]).fill;
      const secondFill = getComputedStyle(getSeriesPoints(1)[0]).fill;
      expect(firstFill).to.contain('url(');
      expect(secondFill).to.contain('url(');
      expect(firstFill).to.not.equal(secondFill);
    });
  });

  describe('removing a series', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' },
            },
          },
          {
            data: [4, 2, 7, 1],
            color: {
              pattern: { id: 'my-custom-pattern', path: PATTERN_PATH, width: 10, height: 10, color: '#0000ff' },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should remove the def of a removed series with an explicit pattern id', async () => {
      expect(getDefsPatterns()).to.have.lengthOf(2);
      expect(chartContainer.querySelector('#my-custom-pattern')).to.exist;

      const redraw = oneEvent(chart, 'chart-redraw');
      chart.configuration.series[1].remove();
      await redraw;

      expect(getDefsPatterns()).to.have.lengthOf(1);
      expect(chartContainer.querySelector('#my-custom-pattern')).to.not.exist;
    });
  });

  describe('patternIndex', () => {
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: { patternIndex: 2 },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should render a def for a built-in pattern index', () => {
      expect(getDefsPatterns()).to.have.lengthOf(1);
    });

    it('should resolve the built-in pattern fill on each point', () => {
      const patternId = getDefsPatterns()[0].getAttribute('id');
      getSeriesPoints().forEach((point) => {
        expect(getComputedStyle(point).fill).to.contain(patternId);
      });
    });
  });

  describe('multiple charts', () => {
    let secondChart, secondContainer;

    beforeEach(async () => {
      const config = {
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' },
            },
          },
        ],
      };

      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration(config);
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;

      secondChart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      secondChart.updateConfiguration(config);
      await oneEvent(secondChart, 'chart-redraw');
      secondContainer = secondChart.$.chart;
    });

    it('should render a def in each chart shadow root', () => {
      expect(chartContainer.querySelectorAll('defs pattern')).to.have.lengthOf(1);
      expect(secondContainer.querySelectorAll('defs pattern')).to.have.lengthOf(1);
    });

    it('should resolve each chart own def from its own points', () => {
      const firstId = chartContainer.querySelector('defs pattern').getAttribute('id');
      const secondId = secondContainer.querySelector('defs pattern').getAttribute('id');

      const pointsIn = (container) =>
        Array.from(container.querySelector('.highcharts-series').querySelectorAll('.highcharts-point'));

      pointsIn(chartContainer).forEach((point) => {
        expect(getComputedStyle(point).fill).to.contain(firstId);
      });
      pointsIn(secondContainer).forEach((point) => {
        expect(getComputedStyle(point).fill).to.contain(secondId);
      });
    });
  });

  describe('image pattern stability', () => {
    const IMAGE =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: {
              pattern: { image: IMAGE },
            },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should keep the same def across a resize', async () => {
      const patternBefore = getDefsPatterns()[0];
      const idBefore = patternBefore.getAttribute('id');

      const redraw = oneEvent(chart, 'chart-redraw');
      chart.configuration.setSize(400, 300);
      await redraw;

      const patternsAfter = getDefsPatterns();
      expect(patternsAfter).to.have.lengthOf(1);
      expect(patternsAfter[0].getAttribute('id')).to.equal(idBefore);
      expect(patternsAfter[0]).to.equal(patternBefore);
    });
  });

  describe('non-patterned marker outline', () => {
    // Regression: removing the color-N :not([fill^='url(']) guard must not let the series
    // color win over the marker outline rule (both are now specificity 0,1,0, so source
    // order decides and the later .highcharts-markers rule must win).
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="scatter"></vaadin-chart>');
      chart.style.setProperty('--vaadin-charts-background', 'rgb(11, 22, 33)');
      chart.style.setProperty('--vaadin-charts-color-0', 'rgb(200, 100, 50)');
      chart.updateConfiguration({
        series: [{ data: [5, 8, 3, 6] }],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should keep the background outline on markers, not the series color', () => {
      const markers = chartContainer.querySelector('.highcharts-markers');
      expect(markers).to.exist;
      const stroke = getComputedStyle(markers).stroke;
      expect(stroke).to.equal('rgb(11, 22, 33)');
      expect(stroke).to.not.equal('rgb(200, 100, 50)');
    });
  });

  describe('removing all patterns', () => {
    // Regression: the stale-fill clear pass must run for every point even when no
    // patterns remain, so a point never keeps an inline url() fill pointing at a
    // destroyed def.
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.style.setProperty('--vaadin-charts-color-0', 'rgb(0, 128, 255)');
      chart.updateConfiguration({
        series: [
          {
            data: [
              5,
              { y: 8, color: { pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#0000ff' } } },
              3,
              6,
            ],
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should clear the inline pattern fill and revert to the series color', async () => {
      expect(getSeriesPoints()[1].style.fill).to.contain('url(');

      // Override the point color with a solid value so no pattern remains (Highcharts
      // merges point options, so a plain number would keep the old pattern color).
      const redraw = oneEvent(chart, 'chart-redraw');
      chart.updateConfiguration({ series: [{ data: [5, { y: 8, color: '#008000' }, 3, 6] }] });
      await redraw;

      getSeriesPoints().forEach((point) => {
        expect(point.style.fill || '').to.not.contain('url(');
        const fill = getComputedStyle(point).fill;
        expect(fill).to.not.contain('url(');
        expect(fill).to.equal('rgb(0, 128, 255)');
      });
      expect(getDefsPatterns()).to.have.lengthOf(0);
    });
  });

  describe('distinct pattern ids', () => {
    // Regression: two different pattern configs must hash to distinct ids (the old signed
    // hash could collide once a negative value's hex digit was string-replaced).
    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart type="column"></vaadin-chart>');
      chart.updateConfiguration({
        series: [
          {
            data: [5, 8, 3, 6],
            color: { pattern: { path: PATTERN_PATH, width: 10, height: 10, color: '#ff0000' } },
          },
          {
            data: [4, 2, 7, 1],
            color: { pattern: { path: 'M 0 0 L 5 5', width: 8, height: 8, color: '#00ff00' } },
          },
        ],
      });
      await oneEvent(chart, 'chart-redraw');
      chartContainer = chart.$.chart;
    });

    it('should generate two distinct vaadin-pattern ids', () => {
      const ids = getDefsPatterns()
        .map((pattern) => pattern.getAttribute('id'))
        .filter((id) => id.startsWith('vaadin-pattern-'));
      expect(ids).to.have.lengthOf(2);
      expect(ids[0]).to.not.equal(ids[1]);
    });
  });
});
