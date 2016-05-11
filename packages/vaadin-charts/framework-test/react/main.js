require('./../../react');
var React = require('./../../node_modules/react');
var ReactDOM = require('./../../node_modules/react-dom');

var PieWithLegend = React.createClass({
  getDefaultProps: function() {
      return {
          data: []
      };
  },
  render: function() {
    return (
      <vaadin-pie-chart>
          <title>Revenue by industry</title>
          <subtitle>2015</subtitle>
          <tooltip is="" point-format="<b>{point.percentage:.1f}%</b>"></tooltip>
          <plot-options>
              <pie is="" allow-point-select={true} show-in-legend={true} cursor="pointer">
                  <data-labels enabled={true} format="{point.name}: {point.y:.1f} M€"></data-labels>
              </pie>
          </plot-options>
          <data-series name="Revenue share">
              <data>{this.props.data.map(JSON.stringify).join(',')}</data>
          </data-series>
      </vaadin-pie-chart>
    )
  }
});

ReactDOM.render(
<PieWithLegend
    data={[ ["Aerospace", 45.0], ["Medical", 26.8], ["Agriculture ", 12.8], ["Automotive", 8.5], ["Consumers", 6.2], ["Subsidies", 0.7] ]}
/>,
document.getElementById('chart')
);
