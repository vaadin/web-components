import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextResize, oneEvent } from '@vaadin/testing-helpers';
import './chart-not-animated-styles.js';
import './theme-styles.js';
import '../src/vaadin-chart.js';

describe('vaadin-chart styling', () => {
  describe('default theme', () => {
    let chart, chartContainer;

    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart>
          <vaadin-chart-series type="pie" title="Tokyo" values="[19, 12, 9, 24, 5]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      await nextResize(chart);
      chartContainer = chart.$.chart;
    });

    it('should not fill data label connectors', () => {
      const connectors = Array.from(chartContainer.querySelectorAll('.highcharts-data-label-connector'));
      expect(connectors).to.have.lengthOf(5);
      connectors.forEach((connector) => expect(getComputedStyle(connector).fill).to.equal('none'));
    });

    it('should hide charts by adding hidden attribute', () => {
      const visibleRect = chartContainer.getBoundingClientRect();
      expect(visibleRect.width).to.be.above(0);
      expect(visibleRect.height).to.be.above(0);

      chart.hidden = true;
      const hiddenRect = chartContainer.getBoundingClientRect();
      expect(hiddenRect.width).to.be.equal(0);
      expect(hiddenRect.height).to.be.equal(0);
    });
  });

  describe('custom theme', () => {
    let chart;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart theme="custom"></vaadin-chart>');
      await oneEvent(chart, 'chart-load');
    });

    it('should set series stroke applied with custom styles', () => {
      const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chart.configuration.xAxis[0].setCategories(MONTHS);
      chart.configuration.addSeries({
        type: 'column',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      });
      const point = chart.$.chart.querySelectorAll('.highcharts-series > .highcharts-point');
      expect(point).to.have.lengthOf(12);
      expect(getComputedStyle(point[0]).stroke).to.equal('rgb(255, 0, 0)');
    });
  });

  describe('contrast colors', () => {
    const TRANSPARENT = 'rgba(0, 0, 0, 0)';
    const SURFACE = 'rgb(1, 2, 3)';
    const OPAQUE_BG = 'rgb(51, 51, 51)';

    let root;

    // The properties are set before `chart-load`, as treemap points transition
    // `stroke`: changing them afterwards would be read mid-transition.
    async function chartWith(properties) {
      const chart = fixtureSync(`
        <vaadin-chart type="treemap" timeline>
          <vaadin-chart-series values='[{ "name": "A", "value": 5 }, { "name": "B", "value": 3 }]'></vaadin-chart-series>
        </vaadin-chart>
      `);
      Object.entries(properties).forEach(([name, value]) => chart.style.setProperty(name, value));
      await oneEvent(chart, 'chart-load');
      root = chart.shadowRoot;
    }

    describe('transparent canvas', () => {
      beforeEach(async () => {
        // Aura's configuration.
        await chartWith({ '--vaadin-charts-background': 'transparent', '--vaadin-charts-surface': SURFACE });
      });

      it('should leave the chart canvas transparent', () => {
        expect(getComputedStyle(root.querySelector('.highcharts-background')).fill).to.equal(TRANSPARENT);
      });

      it('should paint treemap point borders in the surface color', () => {
        const point = root.querySelector('.highcharts-treemap-series .highcharts-point');
        expect(getComputedStyle(point).stroke).to.equal(SURFACE);
      });

      it('should paint the pressed range selector label in the surface color', () => {
        expect(getComputedStyle(root.querySelector('.highcharts-button-pressed text')).fill).to.equal(SURFACE);
      });

      it('should paint the navigator handle in the surface color', () => {
        expect(getComputedStyle(root.querySelector('.highcharts-navigator-handle')).fill).to.equal(SURFACE);
      });
    });

    describe('opaque canvas', () => {
      beforeEach(async () => {
        await chartWith({ '--vaadin-charts-background': OPAQUE_BG });
      });

      it('should paint treemap point borders in the chart background color', () => {
        const point = root.querySelector('.highcharts-treemap-series .highcharts-point');
        expect(getComputedStyle(point).stroke).to.equal(OPAQUE_BG);
      });

      it('should paint the navigator handle in the chart background color', () => {
        expect(getComputedStyle(root.querySelector('.highcharts-navigator-handle')).fill).to.equal(OPAQUE_BG);
      });
    });
  });

  describe('CSS custom properties', () => {
    let chart, configuration;

    beforeEach(async () => {
      chart = fixtureSync('<vaadin-chart></vaadin-chart>');
      chart.style.setProperty('--vaadin-charts-color-0', 'rgb(0, 255, 0)');
      await oneEvent(chart, 'chart-load');
      configuration = chart.configuration;
    });

    it('should set axis color based on CSS custom property', () => {
      const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      configuration.xAxis[0].setCategories(MONTHS);

      // As the first series, this should pick the --vaadin-charts-color-0 css configuration
      configuration.addSeries({
        type: 'column',
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      });

      const rects = chart.$.chart.querySelectorAll('.highcharts-legend-item > rect');
      expect(rects).to.have.lengthOf(1);
      expect(getComputedStyle(rects[0]).fill).to.equal('rgb(0, 255, 0)');
    });
  });

  describe('tooltip rendered outside the shadow root', () => {
    // Resolved value of --_color-0, i.e. --vaadin-user-color-0.
    const SERIES_COLOR = 'oklch(0.52 0.2 240)';

    async function fixtureTooltip(outside, style = '') {
      const chart = fixtureSync(`
        <vaadin-chart type="column" tooltip style="${style}" additional-options='{ "tooltip": { "outside": ${outside} } }'>
          <vaadin-chart-series title="Installation" values="[43934, 52503, 57177]"></vaadin-chart-series>
          <vaadin-chart-series title="Manufacturing" values="[24916, 24064, 29742]"></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      chart.configuration.series[0].points[1].onMouseOver();
      await nextFrame();

      const root = outside ? document.querySelector('.highcharts-tooltip-container') : chart.shadowRoot;
      return root.querySelector('.highcharts-tooltip');
    }

    function tooltipStyles(tooltip) {
      // Scoping matters: unscoped, the inside lookup finds a series graphic.
      const colored = tooltip.matches('.highcharts-color-0') ? tooltip : tooltip.querySelector('.highcharts-color-0');
      return {
        seriesColor: getComputedStyle(colored).fill,
        // The series color must not bleed into the text, through the fill or the stroke.
        textFill: getComputedStyle(tooltip.querySelector('text')).fill,
        textStrokeWidth: getComputedStyle(tooltip.querySelector('text')).strokeWidth,
        markerFill: getComputedStyle(tooltip.querySelector('tspan.highcharts-color-0')).fill,
        strongFill: getComputedStyle(tooltip.querySelector('tspan.highcharts-strong')).fill,
        fontWeight: getComputedStyle(tooltip.querySelector('.highcharts-strong')).fontWeight,
      };
    }

    it('should style an outside tooltip like one inside the shadow root', async () => {
      const outside = tooltipStyles(await fixtureTooltip(true));
      // Unfixed, the outside tooltip falls back to the SVG defaults.
      expect(outside.seriesColor).to.equal(SERIES_COLOR);
      expect(outside.markerFill).to.equal(SERIES_COLOR);
      expect(outside.fontWeight).to.equal('700');
      expect(outside.textFill).to.not.equal(SERIES_COLOR);
      expect(outside.textStrokeWidth).to.equal('0px');
      expect(outside).to.deep.equal(tooltipStyles(await fixtureTooltip(false)));
    });

    // The container is in document.body, so it inherits no chart-scoped palette.
    it('should apply a series color set on the chart to an outside tooltip', async () => {
      const styles = tooltipStyles(await fixtureTooltip(true, '--vaadin-charts-color-0: rgb(1, 2, 3)'));
      expect(styles.seriesColor).to.equal('rgb(1, 2, 3)');
      expect(styles.markerFill).to.equal('rgb(1, 2, 3)');
    });
  });

  describe('solid gauge', () => {
    let chart;

    function points() {
      return [...chart.$.chart.querySelectorAll('.highcharts-solidgauge-series .highcharts-point')];
    }

    async function createChart(yAxis) {
      chart = fixtureSync('<vaadin-chart type="solidgauge"></vaadin-chart>');
      chart.additionalOptions = { yAxis: { min: 0, max: 100, ...yAxis } };
      await oneEvent(chart, 'chart-load');
      chart.configuration.addSeries({
        data: [
          { y: 20, colorIndex: 1 },
          { y: 50, colorIndex: 3 },
        ],
      });
    }

    it('should paint points with their color class when no stops are defined', async () => {
      await createChart();
      expect(points().map((point) => point.getAttribute('class'))).to.eql([
        'highcharts-point highcharts-color-1',
        'highcharts-point highcharts-color-3',
      ]);
      expect(getComputedStyle(points()[0]).fill).to.not.equal('none');
    });

    it('should update the color class when colorIndex changes', async () => {
      await createChart();
      chart.configuration.series[0].points[0].update({ colorIndex: 5 });
      expect(points()[0].getAttribute('class')).to.equal('highcharts-point highcharts-color-5');
    });

    it('should keep the point state class when points are redrawn', async () => {
      await createChart();
      chart.configuration.series[0].points[0].setState('hover');
      chart.configuration.setSize(300, 300, false);
      expect(points()[0].classList.contains('highcharts-point-hover')).to.be.true;
      expect(points()[0].classList.contains('highcharts-color-1')).to.be.true;
    });

    it('should not add color classes when stops are defined', async () => {
      await createChart({
        stops: [
          [0, '#ff0000'],
          [1, '#0000ff'],
        ],
      });
      points().forEach((point) => {
        expect(point.getAttribute('class')).to.equal('highcharts-point');
        expect(point.getAttribute('fill')).to.not.equal('none');
      });
    });

    it('should not clip an animated solid gauge', async () => {
      chart = fixtureSync(`
        <vaadin-chart
          type="solidgauge"
          style="width: 400px; height: 400px"
          additional-options='{
            "chart": { "animation": { "duration": 50 } },
            "plotOptions": { "series": { "animation": { "duration": 50 } } },
            "pane": { "startAngle": 0, "endAngle": 360 },
            "yAxis": { "min": 0, "max": 100 }
          }'
        >
          <vaadin-chart-series values='[{ "y": 80, "radius": "112%", "innerRadius": "88%" }]'></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      await aTimeout(100);

      const series = chart.configuration.series[0];
      const clipId = series.group.element.getAttribute('clip-path').match(/#([^)]+)/u)[1];
      const clip = chart.$.chart.querySelector(`[id="${clipId}"] rect`).getBBox();
      const point = series.points[0].graphic.element.getBBox();
      expect(clip.x).to.be.at.most(point.x);
      expect(clip.y).to.be.at.most(point.y);
    });

    describe('non-styled mode', () => {
      async function createNonStyledChart(yAxis) {
        chart = fixtureSync('<vaadin-chart type="solidgauge"></vaadin-chart>');
        chart.additionalOptions = { chart: { styledMode: false }, yAxis: { min: 0, max: 100, ...yAxis } };
        await oneEvent(chart, 'chart-load');
        chart.configuration.addSeries({ data: [100] });
      }

      it('should paint points with the stop color', async () => {
        await createNonStyledChart({
          stops: [
            [0, '#ff0000'],
            [1, '#0000ff'],
          ],
        });
        expect(getComputedStyle(points()[0]).fill).to.equal('rgb(0, 0, 255)');
      });

      it('should paint points with the series color when no stops are defined', async () => {
        await createNonStyledChart();
        expect(getComputedStyle(points()[0]).fill).to.equal('rgb(44, 175, 254)');
      });
    });

    it('should not clip an animated solid gauge in non-styled mode', async () => {
      chart = fixtureSync(`
        <vaadin-chart
          type="solidgauge"
          style="width: 400px; height: 400px"
          additional-options='{
            "chart": { "styledMode": false, "animation": { "duration": 50 } },
            "plotOptions": { "series": { "animation": { "duration": 50 } } },
            "pane": { "startAngle": 0, "endAngle": 360 },
            "yAxis": { "min": 0, "max": 100 }
          }'
        >
          <vaadin-chart-series values='[{ "y": 80, "radius": "112%", "innerRadius": "88%" }]'></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
      await aTimeout(100);

      expect(chart.configuration.styledMode).to.be.false;
      const series = chart.configuration.series[0];
      const clipId = series.group.element.getAttribute('clip-path').match(/#([^)]+)/u)[1];
      const clip = chart.$.chart.querySelector(`[id="${clipId}"] rect`).getBBox();
      const point = series.points[0].graphic.element.getBBox();
      expect(clip.x).to.be.at.most(point.x);
      expect(clip.y).to.be.at.most(point.y);
    });

    it('should not add color classes when minColor and maxColor are defined', async () => {
      await createChart({ minColor: '#ff0000', maxColor: '#0000ff' });
      points().forEach((point) => {
        expect(point.getAttribute('class')).to.equal('highcharts-point');
        expect(point.getAttribute('fill')).to.not.equal('none');
      });
    });
  });
});
