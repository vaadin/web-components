/* eslint-disable no-invalid-this */
// Workaround for https://github.com/vaadin/vaadin-charts/issues/389
(function() {
  if (Highcharts) {
    ['exportChart', 'exportChartLocal'].forEach(methodName => {
      Highcharts.wrap(
        Highcharts.Chart.prototype,
        methodName,
        function(proceed) {
          Highcharts.fireEvent(this, 'beforeExport');
          const result = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
          Highcharts.fireEvent(this, 'afterExport');
          return result;
        }
      );
    });
  }
}());
