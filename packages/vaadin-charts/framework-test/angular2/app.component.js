System.register(['@angular/core', 'vaadin-charts'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, vaadin_charts_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (vaadin_charts_1_1) {
                vaadin_charts_1 = vaadin_charts_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent() {
                    this.dataSeries = [
                        ["Aerospace", 45.0],
                        ["Medical", 26.8],
                        ["Agriculture ", 12.8],
                        ["Automotive", 8.5],
                        ["Consumers", 6.2],
                        ["Subsidies", 0.7]
                    ];
                }
                AppComponent.prototype.chartReady = function () {
                    var event = new Event('chartsReady');
                    document.querySelector('my-app').dispatchEvent(event);
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        template: "\n  <vaadin-pie-chart on-chart-loaded=\"chartReady()\">\n      <chart-title>Revenue by industry</chart-title>\n      <subtitle>2015</subtitle>\n      <tooltip point-format=\"<b>{point.percentage:.1f}%</b>\"></tooltip>\n      <plot-options>\n          <pie allow-point-select=\"true\" show-in-legend=\"true\"\n               cursor=\"pointer\">\n              <data-labels enabled=\"true\"\n                           format=\"{point.name}: {point.y:.1f} M\u20AC\">\n              </data-labels>\n          </pie>\n      </plot-options>\n      <data-series name=\"Revenue share\" [data]=\"dataSeries\"></data-series>\n  </vaadin-pie-chart>\n    ",
                        directives: [vaadin_charts_1.VaadinCharts, vaadin_charts_1.DataSeries]
                    }), 
                    __metadata('design:paramtypes', [])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map