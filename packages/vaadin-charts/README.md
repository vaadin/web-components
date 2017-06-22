[![Build Status](https://api.travis-ci.org/vaadin/vaadin-charts.svg?branch=master)](https://travis-ci.org/vaadin/vaadin-charts)

# Vaadin Charts

A Web Component for high quality charts.

## Relevant links

- **Product page** https://vaadin.com/charts
- **Demo** https://demo.vaadin.com/vaadin-charts
- **Trial license** https://vaadin.com/pro/licenses

## Overview of the repository

- The main components are:
    - **vaadin-area-chart**
    - **vaadin-arearange-chart**
    - **vaadin-areaspline-chart**
    - **vaadin-areasplinerange-chart**
    - **vaadin-bar-chart**
    - **vaadin-boxplot-chart**
    - **vaadin-bubble-chart**
    - **vaadin-candlestick-chart**
    - **vaadin-column-chart**
    - **vaadin-columnrange-chart**
    - **vaadin-errorbar-chart**
    - **vaadin-flags-chart**
    - **vaadin-funnel-chart**
    - **vaadin-gauge-chart**
    - **vaadin-heatmap-chart**
    - **vaadin-line-chart**
    - **vaadin-ohlc-chart**
    - **vaadin-pie-chart**
    - **vaadin-polygon-chart**
    - **vaadin-pyramid-chart**
    - **vaadin-scatter-chart**
    - **vaadin-solidgauge-chart**
    - **vaadin-sparkline**
    - **vaadin-spline-chart**
    - **vaadin-treemap-chart**
    - **vaadin-waterfall-chart**.
 - Series component is **data-series**.

## Running

1. Clone the repo.
2. Run `npm install` & `bower install` to install all tools and dependencies.
3. Serve the files with [Polyserve](https://github.com/PolymerLabs/polyserve).
4. Go to [http://localhost:8080/components/vaadin-charts/demo/index.html](http://localhost:8080/components/vaadin-charts/demo/index.html) to view a basic demo.

Check out [Vaadin Charts Demo Project](https://github.com/vaadin/vaadin-charts-demo) to run the full demo app.

## Development

 - Main build target for distribution is `stage`, so running `gulp stage` should produce all the deployment files
   inside the target folder.
 - Deployment target is `deploy`, which currently just deploys to a CDN provided in the `local.json` config file. See `config/local.json.example` for more info.
