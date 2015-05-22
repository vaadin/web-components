# Vaadin Charts Web Component

A Web Component for high quality charts. Uses the [Highcharts](http://www.highcharts.com/) JavaScript library.

## Overview of the repository

 - The main component is in **v-chart.html**
 - Series component is in **v-chart-series**
 - Valo theme for Charts is in **valo-theme.html**
 - Demos is in **demo**

## Running

1. Clone the repo
2. Run `bower install` & `npm install`
3. Serve the files with [Polyserve](https://github.com/PolymerLabs/polyserve)
4. Go to http://localhost:8080/components/vaadin-charts/demo/pie.html

## Development

 - Main build target for distribution is `stage`, so running `gulp stage` should produce all the deployment files
   inside the target folder
 - Deployment target is `deploy`, which currently just deploys to a CDN provided in the command line. Example:
   `gulp cdn:deploy --cdnUsername=foo --cdnHost=bar.com --cdnDestination=/some/server/dir/'
