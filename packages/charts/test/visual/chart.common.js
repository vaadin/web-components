import { click, fixtureSync, nextFrame, oneEvent } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import { temperatures } from './temperature-data.js';

// 2018-01-01T00:00:00Z, so nothing depends on the current date.
const DAY_0 = 1514764800000;

/** Timestamp N days after `DAY_0`, so fixtures read as day offsets. */
const day = (n) => DAY_0 + n * 24 * 60 * 60 * 1000;

// Four fixtures deliberately share one dataset so their screenshots stay comparable.
const SOLAR_CATEGORIES = '[2010, 2011, 2012, 2013, 2014]';
const SOLAR_INSTALLATION = '[43934, 52503, 57177, 69658, 97031]';
const SOLAR_MANUFACTURING = '[24916, 24064, 29742, 29851, 32490]';

/** Waits until every given chart has finished its initial render. */
async function whenRendered(charts) {
  await Promise.all(charts.map((chart) => (chart.configuration ? Promise.resolve() : oneEvent(chart, 'chart-load'))));
  // `chart-load` fires before `__initChart` schedules the animation frame that
  // re-measures organization data labels, so wait two frames to outlast it.
  await nextFrame();
  await nextFrame();
}

/** `outside` decides whether the tooltip renders in the shadow root or in `document.body`. */
function buildTooltipFixture(outside) {
  return `
    <vaadin-chart
      type="column"
      title="Solar employment growth"
      tooltip
      style="width: 600px; height: 400px"
      categories="${SOLAR_CATEGORIES}"
      additional-options='{ "tooltip": { "outside": ${outside} } }'
    >
      <vaadin-chart-series title="Installation" values="${SOLAR_INSTALLATION}"></vaadin-chart-series>
      <vaadin-chart-series title="Manufacturing" values="${SOLAR_MANUFACTURING}"></vaadin-chart-series>
    </vaadin-chart>
  `;
}

/** One radial progress gauge; `solidgauge` renders three that differ only in value and colour. */
function buildProgressGauge(y, colorIndex) {
  return `
    <vaadin-chart
      title="Progress"
      type="solidgauge"
      style="width: 200px; height: 260px"
      additional-options='{
        "pane": {
          "center": ["50%", "50%"],
          "startAngle": 0,
          "endAngle": 360,
          "background": { "innerRadius": "60%", "outerRadius": "100%", "shape": "arc" }
        },
        "yAxis": {
          "min": 0,
          "max": 100,
          "minorTickInterval": null,
          "tickAmount": 0,
          "labels": { "enabled": false }
        }
      }'
    >
      <vaadin-chart-series title="Progress" values='[{ "y": ${y}, "colorIndex": ${colorIndex} }]'></vaadin-chart-series>
    </vaadin-chart>
  `;
}

/** Candlestick and OHLC must plot identical data for the up/down point comparison to mean anything. */
function buildOhlcFixture(type, title) {
  return `
    <vaadin-chart
      type="${type}"
      title="${title}"
      style="width: 400px; height: 300px"
      additional-options='{ "xAxis": { "type": "datetime" }, "time": { "timezone": "UTC" } }'
    >
      <vaadin-chart-series
        title="Price"
        values='[
          [${day(0)}, 10, 14, 9, 13],
          [${day(1)}, 13, 15, 11, 11],
          [${day(2)}, 11, 16, 10, 15],
          [${day(3)}, 15, 17, 12, 12],
          [${day(4)}, 12, 18, 12, 17]
        ]'
      ></vaadin-chart-series>
    </vaadin-chart>
  `;
}

/** Funnel and pyramid render the same series to contrast their two shapes. */
function buildFunnelFixture(type, title) {
  return `
    <vaadin-chart type="${type}" title="${title}" style="width: 400px; height: 400px">
      <vaadin-chart-series
        title="Unique users"
        values='[
          ["Website visits", 15654],
          ["Downloads", 4064],
          ["Requested price list", 1987],
          ["Invoice sent", 976],
          ["Finalized", 846]
        ]'
      ></vaadin-chart-series>
    </vaadin-chart>
  `;
}

/**
 * Fixture templates shared between the theme-specific test files. Keys are the
 * screenshot names. Data and sizes are static to keep screenshots stable.
 */
const fixtures = {
  gauge: `
    <vaadin-chart
      type="gauge"
      title="Speedometer"
      style="width: 500px; height: 400px"
      additional-options='{
        "pane": {
          "startAngle": -150,
          "endAngle": 150
        },
        "yAxis": {
          "min": 0,
          "max": 200,
          "minorTickInterval": "auto",
          "minorTickLength": 10,
          "minorTickPosition": "inside",
          "tickPixelInterval": 30,
          "tickPosition": "inside",
          "tickLength": 10,
          "labels": {
            "step": 2,
            "rotation": "auto"
          },
          "title": {
            "text": "km/h"
          },
          "plotBands": [
            { "from": 0, "to": 120 },
            { "from": 120, "to": 160 },
            { "from": 160, "to": 200 }
          ]
        }
      }'
    >
      <vaadin-chart-series title="Speed" values="[89]"></vaadin-chart-series>
    </vaadin-chart>
  `,

  // The first gauge sets bare-number `radius` / `innerRadius` on the series,
  // which Highcharts 13 reads as pixels where 12 read them as percentages. The
  // string percentages on `pane.background` are unaffected by that change.
  solidgauge: `
    <div style="display: flex; width: 800px; height: 260px">
      <vaadin-chart
        title="Speed"
        type="solidgauge"
        style="width: 200px; height: 260px"
        additional-options='{
          "pane": {
            "center": ["50%", "85%"],
            "startAngle": -90,
            "endAngle": 90,
            "background": { "innerRadius": "60%", "outerRadius": "100%", "shape": "arc" }
          },
          "yAxis": {
            "min": 0,
            "max": 200,
            "minorTickInterval": null,
            "tickAmount": 2,
            "labels": { "y": 16 }
          }
        }'
      >
        <vaadin-chart-series
          title="Speed"
          values='[{ "y": 80, "colorIndex": 1 }]'
          additional-options='{ "radius": 100, "innerRadius": 60 }'
        ></vaadin-chart-series>
      </vaadin-chart>${[
        [12, 2],
        [47, 3],
        [80, 4],
      ]
        .map(([y, colorIndex]) => buildProgressGauge(y, colorIndex))
        .join('')}
    </div>
  `,

  polar: `
    <vaadin-chart
      title="Polar Chart"
      polar
      style="width: 600px; height: 400px"
      additional-options='{
        "xAxis": {
          "tickInterval": 45,
          "min": 0,
          "max": 360
        },
        "yAxis": {
          "min": 0
        },
        "plotOptions": {
          "series": {
            "pointStart": 0,
            "pointInterval": 45
          },
          "column": {
            "pointPadding": 0,
            "groupPadding": 0
          }
        }
      }'
    >
      <vaadin-chart-series
        type="column"
        title="Column"
        values="[8, 7, 6, 5, 4, 3, 2, 1]"
        additional-options='{ "pointPlacement": "between" }'
      ></vaadin-chart-series>
      <vaadin-chart-series type="line" title="Line" values="[1, 2, 3, 4, 5, 6, 7, 8]"></vaadin-chart-series>
      <vaadin-chart-series type="area" title="Area" values="[1, 8, 2, 7, 3, 6, 4, 5]"></vaadin-chart-series>
    </vaadin-chart>
  `,

  spiderweb: `
    <vaadin-chart
      title="Budget vs spending"
      polar
      style="width: 600px; height: 400px"
      categories='["Sales", "Marketing", "Development", "Customer Support", "Information Technology", "Administration"]'
      additional-options='{
        "legend": {
          "align": "right",
          "verticalAlign": "top",
          "y": 70,
          "layout": "vertical"
        },
        "xAxis": {
          "tickmarkPlacement": "on"
        },
        "yAxis": {
          "gridLineInterpolation": "polygon"
        }
      }'
    >
      <vaadin-chart-series
        type="line"
        title="Allocated Budget"
        values="[43000, 19000, 60000, 35000, 17000, 10000]"
      ></vaadin-chart-series>
      <vaadin-chart-series
        type="line"
        title="Actual Spending"
        values="[50000, 39000, 42000, 31000, 26000, 14000]"
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  treemap: `
    <vaadin-chart type="treemap" title="Fruit consumption" style="width: 600px; height: 400px">
      <vaadin-chart-series
        values='[
          { "id": "A", "name": "Apples", "colorIndex": "0" },
          { "id": "B", "name": "Bananas", "colorIndex": "2" },
          { "id": "O", "name": "Oranges", "colorIndex": "3" },
          { "name": "Anne", "parent": "A", "value": 5 },
          { "name": "Rick", "parent": "A", "value": 3 },
          { "name": "Peter", "parent": "A", "value": 4 },
          { "name": "Anne", "parent": "B", "value": 4 },
          { "name": "Rick", "parent": "B", "value": 10 },
          { "name": "Peter", "parent": "B", "value": 1 },
          { "name": "Anne", "parent": "O", "value": 1 },
          { "name": "Rick", "parent": "O", "value": 3 },
          { "name": "Peter", "parent": "O", "value": 3 }
        ]'
        additional-options='{
          "levels": [
            {
              "level": 1,
              "dataLabels": { "enabled": true, "align": "left", "verticalAlign": "top" }
            }
          ]
        }'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  organization: `
    <vaadin-chart
      type="organization"
      title="Acme organization chart"
      style="width: 800px; height: 500px"
      additional-options='{ "chart": { "inverted": true } }'
    >
      <vaadin-chart-series
        title="Acme"
        values='[
          ["Acme", "Head Office"],
          ["Acme", "Labs"],
          ["Head Office", "Coyote Building"],
          ["Head Office", "Road Runner Building"],
          ["Coyote Building", "Sales"],
          ["Coyote Building", "Marketing"],
          ["Road Runner Building", "Administration"],
          ["Road Runner Building", "MDs Office"],
          ["Sales", "Joseph Miler"],
          ["Marketing", "Erik Perez"],
          ["Administration", "Ewan Herbert"],
          ["MDs Office", "Sally Brown"]
        ]'
        additional-options='{
          "keys": ["from", "to"],
          "levels": [
            { "level": 0, "height": 25 },
            { "level": 1, "height": 25 }
          ],
          "nodes": [
            { "id": "Joseph Miler", "title": "Head of Sales" },
            { "id": "Erik Perez", "title": "Head of Marketing" },
            { "id": "Ewan Herbert", "title": "Head of Admin" },
            { "id": "Sally Brown", "title": "Managing Director" }
          ],
          "nodeWidth": 65
        }'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  // `colorAxis.minColor` / `maxColor` are left unset on purpose. The gradient is
  // computed in JS and has no CSS hook, so pinning hex here would only hide a
  // change in Highcharts' own defaults.
  heatmap: `
    <vaadin-chart
      type="heatmap"
      title="Sales per employee per weekday"
      style="width: 700px; height: 400px"
      additional-options='{
        "xAxis": {
          "categories": ["Alexander", "Marie", "Maximilian", "Sophia", "Lukas", "Maria", "Leon", "Anna", "Tim", "Laura"]
        },
        "yAxis": {
          "categories": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "title": null
        },
        "colorAxis": { "min": 0 },
        "legend": {
          "align": "right",
          "layout": "vertical",
          "margin": 0,
          "verticalAlign": "top",
          "y": 25,
          "symbolHeight": 280
        }
      }'
    >
      <vaadin-chart-series
        title="Sales per employee"
        values="[
          [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
          [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
          [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
          [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
          [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
          [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
          [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96],
          [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
          [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
          [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]
        ]"
        additional-options='{ "dataLabels": { "enabled": true } }'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  // The buttons are declared explicitly because the default set includes a YTD
  // button, whose range depends on the current date. The time zone is pinned for
  // the same reason: axis labels otherwise follow the machine's local zone.
  navigator: `
    <vaadin-chart
      type="areasplinerange"
      title="Temperature variation by day"
      timeline
      style="width: 800px; height: 400px"
      additional-options='{
        "time": { "timezone": "UTC" },
        "rangeSelector": {
          "selected": 1,
          "buttons": [
            { "type": "month", "count": 1, "text": "1m" },
            { "type": "month", "count": 3, "text": "3m" },
            { "type": "month", "count": 6, "text": "6m" },
            { "type": "year", "count": 1, "text": "1y" },
            { "type": "all", "text": "All" }
          ]
        }
      }'
    >
      <vaadin-chart-series title="Temperatures" values='${JSON.stringify(temperatures)}'></vaadin-chart-series>
    </vaadin-chart>
  `,

  tooltip: buildTooltipFixture(false),

  'tooltip-outside': buildTooltipFixture(true),
};

/**
 * Fixtures rendered only by `base/chart.test.js`. They guard the shared base
 * stylesheet, so Lumo and Aura baselines would mostly repeat the same check.
 * Each covers an imported Highcharts module no other fixture renders.
 */
const baseOnlyFixtures = {
  // Covers the treegrid axis and the partial-fill overlay. `type="gantt"` also
  // takes its own `Highcharts.ganttChart` branch in the mixin.
  gantt: `
    <vaadin-chart
      type="gantt"
      title="Project schedule"
      style="width: 800px; height: 500px"
      additional-options='{
        "xAxis": { "min": ${day(0)}, "max": ${day(12)} },
        "time": { "timezone": "UTC" }
      }'
    >
      <vaadin-chart-series
        title="Project"
        values='[
          { "id": "design", "name": "Design", "start": ${day(0)}, "end": ${day(5)} },
          { "name": "Wireframes", "parent": "design", "start": ${day(0)}, "end": ${day(2)}, "completed": 1 },
          { "name": "Mockups", "parent": "design", "start": ${day(2)}, "end": ${day(5)}, "completed": 0.6 },
          { "id": "build", "name": "Build", "start": ${day(5)}, "end": ${day(11)} },
          { "name": "Implement", "parent": "build", "start": ${day(5)}, "end": ${day(9)}, "completed": 0.25 },
          { "name": "Test", "parent": "build", "start": ${day(9)}, "end": ${day(11)} },
          { "name": "Ship", "start": ${day(11)}, "milestone": true }
        ]'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  // The context button and menu are the only chart chrome the `styled-mode`
  // export test never renders.
  'exporting-menu': `
    <vaadin-chart
      type="column"
      title="Solar employment growth"
      style="width: 600px; height: 400px"
      categories="[2010, 2011, 2012, 2013, 2014]"
      additional-options='{ "exporting": { "enabled": true } }'
    >
      <vaadin-chart-series title="Installation" values="[43934, 52503, 57177, 69658, 97031]"></vaadin-chart-series>
    </vaadin-chart>
  `,

  // Selecting one point and hovering another renders the selected and hover
  // states plus the inactive states on the sibling series.
  'point-states': `
    <vaadin-chart
      type="column"
      title="Point states"
      style="width: 600px; height: 400px"
      categories="[2010, 2011, 2012, 2013, 2014]"
      additional-options='{ "plotOptions": { "series": { "allowPointSelect": true } } }'
    >
      <vaadin-chart-series title="Installation" values="[43934, 52503, 57177, 69658, 97031]"></vaadin-chart-series>
      <vaadin-chart-series title="Manufacturing" values="[24916, 24064, 29742, 29851, 32490]"></vaadin-chart-series>
    </vaadin-chart>
  `,

  funnel: `
    <div style="display: flex; width: 800px; height: 400px">
      ${buildFunnelFixture('funnel', 'Sales funnel')}
      ${buildFunnelFixture('pyramid', 'Sales pyramid')}
    </div>
  `,

  // `maxHeight` forces the legend to paginate, which is the only way the
  // legend navigation arrows ever render.
  'legend-states': `
    <vaadin-chart
      type="line"
      title="Legend states"
      style="width: 600px; height: 400px"
      additional-options='{
        "legend": { "layout": "vertical", "align": "right", "verticalAlign": "top", "maxHeight": 90 }
      }'
    >
      <vaadin-chart-series title="Alpha" values="[1, 2, 3, 4, 5]"></vaadin-chart-series>
      <vaadin-chart-series title="Bravo" values="[2, 3, 4, 5, 6]"></vaadin-chart-series>
      <vaadin-chart-series title="Charlie" values="[3, 4, 5, 6, 7]"></vaadin-chart-series>
      <vaadin-chart-series title="Delta" values="[4, 5, 6, 7, 8]"></vaadin-chart-series>
      <vaadin-chart-series title="Echo" values="[5, 6, 7, 8, 9]"></vaadin-chart-series>
      <vaadin-chart-series title="Foxtrot" values="[6, 7, 8, 9, 10]"></vaadin-chart-series>
    </vaadin-chart>
  `,

  'no-data': `
    <vaadin-chart
      title="Nothing to show"
      empty-text="No data available"
      style="width: 600px; height: 400px"
    ></vaadin-chart>
  `,

  sankey: `
    <vaadin-chart type="sankey" title="Energy flow" style="width: 700px; height: 400px">
      <vaadin-chart-series
        title="Flow"
        values='[
          ["Coal", "Electricity", 30],
          ["Gas", "Electricity", 25],
          ["Wind", "Electricity", 20],
          ["Solar", "Electricity", 10],
          ["Electricity", "Industry", 40],
          ["Electricity", "Housing", 30],
          ["Electricity", "Transport", 15]
        ]'
        additional-options='{ "keys": ["from", "to", "weight"] }'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  // `useHTML` on the tooltip and the legend. Both base-style rules for that DOM
  // select a `span`, which Highcharts 13 replaces with a `foreignObject > div`,
  // so they would stop matching without a word from any test.
  'use-html': `
    <vaadin-chart
      type="column"
      title="Rendered with useHTML"
      tooltip
      style="width: 600px; height: 400px"
      categories="[2010, 2011, 2012, 2013, 2014]"
      additional-options='{
        "tooltip": { "useHTML": true },
        "legend": { "useHTML": true },
        "plotOptions": { "series": { "dataLabels": { "enabled": true, "useHTML": true } } }
      }'
    >
      <vaadin-chart-series title="Installation" values="[43934, 52503, 57177, 69658, 97031]"></vaadin-chart-series>
      <vaadin-chart-series title="Manufacturing" values="[24916, 24064, 29742, 29851, 32490]"></vaadin-chart-series>
    </vaadin-chart>
  `,

  // Covers the highstock-only up and down point rules.
  candlestick: `
    <div style="display: flex; width: 800px; height: 300px">
      ${buildOhlcFixture('candlestick', 'Candlestick')}
      ${buildOhlcFixture('ohlc', 'OHLC')}
    </div>
  `,

  // Box plot and error bar share one chart; both come from `highcharts-more`.
  boxplot: `
    <vaadin-chart
      title="Box plot and error bars"
      style="width: 600px; height: 400px"
      categories='["A", "B", "C", "D", "E"]'
    >
      <vaadin-chart-series
        type="boxplot"
        title="Observations"
        values='[
          [760, 801, 848, 895, 965],
          [733, 853, 939, 980, 1080],
          [714, 762, 817, 870, 918],
          [724, 802, 806, 871, 950],
          [834, 836, 864, 882, 910]
        ]'
      ></vaadin-chart-series>
      <vaadin-chart-series
        type="errorbar"
        title="Error range"
        values="[[800, 900], [850, 1000], [780, 880], [790, 900], [850, 890]]"
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  bubble: `
    <vaadin-chart type="bubble" title="Bubble chart" style="width: 600px; height: 400px">
      <vaadin-chart-series
        title="Alpha"
        values="[[1, 20, 15], [2, 40, 30], [3, 25, 45], [4, 60, 20], [5, 35, 60]]"
      ></vaadin-chart-series>
      <vaadin-chart-series
        title="Bravo"
        values="[[1, 50, 25], [2, 15, 55], [3, 55, 20], [4, 30, 40], [5, 45, 35]]"
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  timeline: `
    <vaadin-chart
      type="timeline"
      title="Release timeline"
      style="width: 700px; height: 400px"
      additional-options='{
        "xAxis": { "visible": false, "min": ${day(-15)}, "max": ${day(105)} },
        "yAxis": { "visible": false },
        "time": { "timezone": "UTC" }
      }'
    >
      <vaadin-chart-series
        title="Releases"
        values='[
          { "x": ${day(0)}, "name": "Alpha", "label": "First alpha" },
          { "x": ${day(30)}, "name": "Beta", "label": "Public beta" },
          { "x": ${day(60)}, "name": "RC", "label": "Release candidate" },
          { "x": ${day(90)}, "name": "GA", "label": "General availability" }
        ]'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  // `partialFill` paints nothing today: the only `.highcharts-partfill-overlay`
  // rule is scoped to `.highcharts-gantt-series`. Kept so that adding an xrange
  // rule later shows up as a diff.
  xrange: `
    <vaadin-chart
      type="xrange"
      title="Task ranges"
      style="width: 700px; height: 300px"
      additional-options='{
        "xAxis": { "type": "datetime", "min": ${day(0)}, "max": ${day(10)} },
        "yAxis": { "categories": ["Prototype", "Develop", "Ship"], "title": null },
        "time": { "timezone": "UTC" }
      }'
    >
      <vaadin-chart-series
        title="Tasks"
        values='[
          { "x": ${day(0)}, "x2": ${day(3)}, "y": 0 },
          { "x": ${day(3)}, "x2": ${day(8)}, "y": 1, "partialFill": 0.4 },
          { "x": ${day(8)}, "x2": ${day(10)}, "y": 2 }
        ]'
        additional-options='{ "pointWidth": 20 }'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,

  bullet: `
    <vaadin-chart
      type="bullet"
      title="Bullet chart"
      style="width: 600px; height: 300px"
      categories='["Revenue", "Profit", "Orders"]'
      additional-options='{
        "yAxis": {
          "plotBands": [
            { "from": 0, "to": 150 },
            { "from": 150, "to": 225 },
            { "from": 225, "to": 300 }
          ],
          "title": null
        }
      }'
    >
      <vaadin-chart-series
        title="Actual"
        values='[
          { "y": 275, "target": 250 },
          { "y": 160, "target": 220 },
          { "y": 210, "target": 190 }
        ]'
      ></vaadin-chart-series>
    </vaadin-chart>
  `,
};

/** Hovers a point so that the tooltip is rendered. */
async function showTooltip(chart) {
  chart.configuration.series[0].points[2].onMouseOver();
  await nextFrame();
}

/** Opens the exporting context menu. */
async function openExportMenu(chart) {
  click(chart.shadowRoot.querySelector('.highcharts-contextbutton'));
  await nextFrame();
}

/** Selects one point and hovers another, in two different series. */
async function selectAndHoverPoints(chart) {
  const [first] = chart.configuration.series;
  first.points[1].select();
  first.points[3].onMouseOver();
  await nextFrame();
}

/**
 * Hides one legend item and pages the legend forward. The last series is hidden
 * so that it stays on the page shown, instead of scrolling out of the shot.
 */
async function hideSeriesAndPageLegend(chart) {
  const { series, legend } = chart.configuration;
  series[series.length - 1].setVisible(false, true);
  legend.scroll(1, false);
  await nextFrame();
}

/** Extra work a fixture needs after rendering, applied to its first chart. */
const interactions = {
  tooltip: showTooltip,
  'tooltip-outside': showTooltip,
  'use-html': showTooltip,
  'exporting-menu': openExportMenu,
  'point-states': selectAndHoverPoints,
  'legend-states': hideSeriesAndPageLegend,
};

const allFixtures = { ...fixtures, ...baseOnlyFixtures };

/** Names of the fixtures `base/chart.test.js` renders on its own. */
export const BASE_ONLY_FIXTURES = Object.keys(baseOnlyFixtures);

/** Renders the named fixture and returns the element to snapshot. */
async function renderFixture(name) {
  const root = fixtureSync(allFixtures[name]);
  const charts = root.localName === 'vaadin-chart' ? [root] : [...root.querySelectorAll('vaadin-chart')];
  await whenRendered(charts);
  if (interactions[name]) {
    await interactions[name](charts[0]);
  }
  return root;
}

/**
 * Declares one screenshot test per fixture. Passing `dark` renders them with a
 * dark colour scheme and appends `-dark` to the screenshot names, so that the
 * scheme and the name it produces are declared in one place.
 */
export function defineScreenshotTests(names, { dark = false } = {}) {
  if (dark) {
    beforeEach(() => {
      document.documentElement.style.setProperty('color-scheme', 'dark');
    });

    afterEach(() => {
      document.documentElement.style.removeProperty('color-scheme');
    });
  }

  names.forEach((name) => {
    const screenshot = dark ? `${name}-dark` : name;
    it(screenshot, async () => {
      await visualDiff(await renderFixture(name), screenshot);
    });
  });
}

/** The fixtures every theme renders. Called by each theme's test file. */
export function defineSharedScreenshotTests() {
  describe('chart types', () => {
    defineScreenshotTests(Object.keys(fixtures));
  });
}
