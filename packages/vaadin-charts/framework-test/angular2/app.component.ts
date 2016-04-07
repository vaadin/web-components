import {Component} from 'angular2/core';
import {VaadinCharts, DataSeries} from 'vaadin-charts';

@Component({
  selector: 'my-app',
  template: `
  <vaadin-pie-chart on-chart-loaded="chartReady()">
      <chart-title>Revenue by industry</chart-title>
      <subtitle>2015</subtitle>
      <tooltip point-format="<b>{point.percentage:.1f}%</b>"></tooltip>
      <plot-options>
          <pie allow-point-select="true" show-in-legend="true"
               cursor="pointer">
              <data-labels enabled="true"
                           format="{point.name}: {point.y:.1f} M€">
              </data-labels>
          </pie>
      </plot-options>
      <data-series name="Revenue share" [data]="dataSeries"></data-series>
  </vaadin-pie-chart>
    `,
  directives: [VaadinCharts, DataSeries]
})
export class AppComponent {

  dataSeries = [
      ["Aerospace", 45.0],
      ["Medical", 26.8],
      ["Agriculture ", 12.8],
      ["Automotive", 8.5],
      ["Consumers", 6.2],
      ["Subsidies", 0.7]
  ];

  chartReady() {
    var event = new Event('chartsReady');
    document.querySelector('my-app').dispatchEvent(event);
  }
}
