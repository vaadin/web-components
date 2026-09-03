import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextFrame, nextResize, oneEvent } from '@vaadin/testing-helpers';
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

  describe('contrast colours with a transparent background', () => {
    const TRANSPARENT = 'rgba(0, 0, 0, 0)';
    let chart;

    // `beforeEach`, not `before`: `fixtureSync` removes the element after each test.
    beforeEach(async () => {
      chart = fixtureSync(`
        <vaadin-chart type="treemap" timeline style="--vaadin-charts-background: transparent">
          <vaadin-chart-series values='[{ "name": "A", "value": 5 }, { "name": "B", "value": 3 }]'></vaadin-chart-series>
        </vaadin-chart>
      `);
      await oneEvent(chart, 'chart-load');
    });

    it('should leave the chart canvas transparent', () => {
      const background = chart.shadowRoot.querySelector('.highcharts-background');
      expect(getComputedStyle(background).fill).to.equal(TRANSPARENT);
    });

    it('should paint a visible border around treemap points', () => {
      const point = chart.shadowRoot.querySelector('.highcharts-treemap-series .highcharts-point');
      expect(getComputedStyle(point).stroke).to.not.equal(TRANSPARENT);
    });

    it('should paint a visible label on the pressed range selector button', () => {
      const button = chart.shadowRoot.querySelector('.highcharts-button-pressed');
      const label = button.querySelector('text');
      // The pressed button inverts, so its label reads against the box, not the page.
      expect(getComputedStyle(label).fill).to.not.equal(TRANSPARENT);
      expect(getComputedStyle(label).fill).to.not.equal(getComputedStyle(button).fill);
    });

    // No screenshot covers the navigator handle, loading overlay, export menu
    // or crosshair label, which the same defect reached.
    it('should paint a visible navigator handle', () => {
      const handle = chart.shadowRoot.querySelector('.highcharts-navigator-handle');
      expect(getComputedStyle(handle).fill).to.not.equal(TRANSPARENT);
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

  // chartStyles only reaches the shadow root, so a tooltip rendered in
  // document.body has to be styled through the global stylesheet instead.
  describe('tooltip rendered outside the shadow root', () => {
    // Resolved value of --_color-0, i.e. --vaadin-user-color-0.
    const SERIES_COLOR = 'oklch(0.52 0.2 240)';

    async function tooltipStyles(outside, style = '') {
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
      const tooltip = root.querySelector('.highcharts-tooltip');
      // Scoping matters: unscoped, the inside lookup finds a series graphic.
      const colored = tooltip.matches('.highcharts-color-0') ? tooltip : tooltip.querySelector('.highcharts-color-0');
      return {
        seriesColor: getComputedStyle(colored).fill,
        // The series colour must not bleed from the tooltip element into its text,
        // through either the fill or an inherited stroke on the glyphs.
        textFill: getComputedStyle(tooltip.querySelector('text')).fill,
        textStrokeWidth: getComputedStyle(tooltip.querySelector('text')).strokeWidth,
        markerFill: getComputedStyle(tooltip.querySelector('tspan.highcharts-color-0')).fill,
        strongFill: getComputedStyle(tooltip.querySelector('tspan.highcharts-strong')).fill,
        fontWeight: getComputedStyle(root.querySelector('.highcharts-strong')).fontWeight,
      };
    }

    it('should style an outside tooltip like one inside the shadow root', async () => {
      const outside = await tooltipStyles(true);
      // Unfixed, the outside tooltip falls back to the SVG defaults.
      expect(outside.seriesColor).to.equal(SERIES_COLOR);
      expect(outside.markerFill).to.equal(SERIES_COLOR);
      expect(outside.fontWeight).to.equal('700');
      expect(outside.textFill).to.not.equal(SERIES_COLOR);
      expect(outside.textStrokeWidth).to.equal('0px');
      expect(outside).to.deep.equal(await tooltipStyles(false));
    });

    // The container sits in document.body, so it inherits neither a per-chart
    // override nor a palette a theme scopes to vaadin-chart, as Lumo does.
    it('should apply a series color set on the chart to an outside tooltip', async () => {
      const styles = await tooltipStyles(true, '--vaadin-charts-color-0: rgb(1, 2, 3)');
      expect(styles.seriesColor).to.equal('rgb(1, 2, 3)');
      expect(styles.markerFill).to.equal('rgb(1, 2, 3)');
    });
  });
});
