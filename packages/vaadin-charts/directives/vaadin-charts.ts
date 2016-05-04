import {
Directive,
ElementRef,
OnInit,
Input,
DoCheck,
IterableDiffers,
NgZone
} from '@angular/core';
declare var Polymer: any;

@Directive({
  selector: `
  vaadin-area-chart,
  vaadin-arearange-chart,
  vaadin-areaspline-chart,
  vaadin-areasplinerange-chart,
  vaadin-bar-chart,
  vaadin-boxplot-chart,
  vaadin-bubble-chart,
  vaadin-candlestick-chart,
  vaadin-column-chart,
  vaadin-columnrange-chart,
  vaadin-errorbar-chart,
  vaadin-flags-chart,
  vaadin-funnel-chart,
  vaadin-gauge-chart,
  vaadin-heatmap-chart,
  vaadin-line-chart,
  vaadin-ohlc-chart,
  vaadin-pie-chart,
  vaadin-polygon-chart,
  vaadin-pyramid-chart,
  vaadin-scatter-chart,
  vaadin-solidgauge-chart,
  vaadin-sparkline,
  vaadin-spline-chart,
  vaadin-treemap-chart,
  vaadin-waterfall-chart
  `
})
export class VaadinCharts implements OnInit {

  private _element: any;

  constructor(private _el: ElementRef, private zone: NgZone) {
    this._element = this._el.nativeElement;
  }

  ngOnInit() {
    if (!(<any>window).Polymer || !Polymer.isInstance(this._element)) {
      console.error("vaadin-charts has not been registered yet, please remember to import vaadin-charts in your main HTML page. http://webcomponents.org/polyfills/html-imports/");
      return;
    }
    this.fixLightDom();
  }

  fixLightDom() {
    // Move all elements targeted to light dom to the actual light dom with Polymer apis
    const misplaced = this._element.querySelectorAll("*:not(.style-scope)");
    [].forEach.call(misplaced, (e: any) => {
      if (e.parentElement === this._element) {
        Polymer.dom(this._element).appendChild(e);
      }
    });

    // Reload Chart if needed.
    if (this._element.isInitialized && this._element.isInitialized()) {
      // Reload outside of Angular to prevent DataSeries.ngDoCheck being called on every mouse event.
      this.zone.runOutsideAngular(() => {
        this._element.reloadConfiguration();
      });
    }
  }

}

@Directive({
  selector: 'data-series'
})
export class DataSeries implements OnInit, DoCheck {

  private _element: any;
  private _differ: any;

  @Input()
  data: any;

  constructor(private _el: ElementRef, differs: IterableDiffers, private _chart: VaadinCharts) {
    this._differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this._element = this._el.nativeElement;
  }

  ngDoCheck() {
    // This is needed to be able to specify data as a string.
    // <data-series data="[123,32,42,11]"> </data-series> won't work without it.
    if (typeof (this.data) !== 'object') {
      try {
        this.data = JSON.parse(this.data);
        if (typeof (this.data) !== 'object') {
          throw 'type is not object';
        }
      } catch (err) {
        try {
          this.data = JSON.parse('[' + this.data + ']');
        } catch (err) {
          return;
        }
      }
    }
    const changes = this._differ.diff(this.data);

    if (changes) {
      // The data property must be set to a clone of the collection.
      this._element.data = changes.collection.slice(0);
    }
  }
}
