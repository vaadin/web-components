# v-chart element

## Basic Use
`v-chart` element is the Web Component used to declare a chart. 

It has a type property used to determine the chart type to be displayed, valid values are: 

*   area
*   arearange
*   areaspline
*   areasplinerange
*   bar
*   boxplot
*   bubble
*   column
*   columnrange
*   errorbar
*   funner
*   gauge
*   heatmap
*   line
*   pie
*   polygon
*   pyramid
*   scatter
*   series
*   solidgauge
*   spline
*   treemap
*   waterfall

Current version only guarantees support for `pie` type related configuration, but most configuration will work with other chart types too.

## v-chart configuration

In order to customize the chart the following elements can be nested:

### title
Defines the Chart's main title content and style. 
Content can be set as the inner text of the element or using the text attribute.
    
    <title>This will be the chart title</title>
Is equivalent to:

    <title text="This will be the chart title"></title>
### subtitle
Defines the Chart's `subtitle` content and style. 
Content can be set as the inner text of the element or using the text attribute.
    
    <subtitle>This will be the chart subtitle</subtitle>
Is equivalent to:

    <subtitle text="This will be the chart subtitle"></subtitle>
### tooltip
Defines options for the `tooltip` that appears when the user hovers over a series or point

    <tooltip point-format="{series.name}: <b>{point.percentage:.1f}%</b>">
    </tooltip>

Important attributes:

*   point-format: The HTML of the point's line in the tooltip. Variables are enclosed by curly brackets. Available variables are point.x, point.y, series.name and series.color
*   shared: When the tooltip is shared, the entire plot area will capture mouse movement or touch events
*   value-decimals: How many decimals to show in each series' y value.
*   value-prefix: A string to prepend to each series' y value.
*   value-suffix: A string to append to each series' y value. 

### legend
The `legend` is a box containing a symbol and name for each series item or point item in the chart.
    <legend enabled="false"></legend>

Important attributes:

*   enabled: Enable or disable the legend. Defaults to true.
*   align: The horizontal alignment of the legend box within the chart area. Valid values are "left", "center" and "right". Defaults to center.
*   vertical-align: The vertical alignment of the legend box. Can be one of "top", "middle" or "bottom". Vertical position can be further determined by the y option. Defaults to bottom.

### plot-options
The `plot-options` element is a wrapper object for config objects for each series type.

### plot-options pie
Specific `pie` element inside a plot-options element will enable specific configurations for pie charts

    <plot-options>
        <pie allow-point-select="true" cursor="pointer">
            <data-labels enabled="true" format="<b>{point.name}</b>: {point.percentage:.1f} %">
            </data-labels>
        </pie>
    </plot-options>

Important attributes:

*   allow-point-select: Allow this series' points to be selected by clicking on the pie slices. Defaults to false.
*   border-color: The color of the border surrounding each slice. 
*   border-width: The  width of the border surrounding each slice. Defaults to 1.
*   cursor: You can set the cursor to "pointer" if you have click events attached to the series, to signal to the user that the slices can be clicked
*   start-angle: The start angle of the pie slices in degrees where 0 is top and 90 right. Defaults to 0.
*   end-angle: The end angle of the pie in degrees where 0 is top and 90 is right. Defaults to startAngle plus 360.
*   show-in-legend: Whether to display this particular series or series type in the legend. Defaults to false.

Important sub-elements:

#### data-labels
A `data-labels` element allows to define content and style for labels created for each point

    <data-labels enabled="true" format="<b>{point.name}</b>: {point.percentage:.1f} %">
    </data-labels>

Important attributes:

*   enabled: Enable or disable the data labels. Defaults to true.
*   format: A format string for the data label. Available variables are the same as for formatter. Defaults to {y}.
*   connector-color: The color of the line connecting the data label to the pie slice. The default color is the same as the point's color. Defaults to {point.color}.


# v-chart-series element
`v-chart-series` is the element used to add a single or multiple series of data to a chart.

## Basic Use
`values` is the main attribute of the series since it will allow defining the chart data.

    <v-chart-series name="Browser share" values="[[&quot;Chrome&quot;,   49.19],
        [&quot;IE&quot;,       18.06],
        [&quot;Firefox&quot;, 16.96],
        [&quot;Safari&quot;,    10.4],
        [&quot;Opera&quot;,     1.65],
        [&quot;Others&quot;,   3.74]]">
    </v-chart-series>

Other important attributes:

*   name: The name of the series as shown in the legend, tooltip etc.
*   inner-size: The size of the inner diameter for the pie. A size greater than 0 renders a donut chart. Can be a percentage or pixel value. Percentages are relative to the pie size. Pixel values are given as integers.
*   min-size: The minimum size for a pie in response to auto margins. The pie will try to shrink to make room for data labels in side the plot area, but only to this size. Defaults to 80.
*   size: The diameter of the pie relative to the plot area. Can be a percentage or pixel value. Pixel values are given as integers. 