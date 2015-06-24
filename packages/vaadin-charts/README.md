# Vaadin Charts Web Component

A Web Component for high quality charts. Uses the [Highcharts](http://www.highcharts.com/) JavaScript library.

## Overview of the repository

 - The main component is **v-chart.html**.
 - Series component is **v-series**.
 - Valo theme for Charts is **valo-theme.html**.
 - Demos are inside **demo**.

## Running

1. Clone the repo.
2. Run `npm install` & `bower install` to install all tools and dependencies.
3. Serve the files with [Polyserve](https://github.com/PolymerLabs/polyserve).
4. Go to http://localhost:8080/components/vaadin-charts/demo/pie.html to view the demo.

## Development

 - Main build target for distribution is `stage`, so running `gulp stage` should produce all the deployment files
   inside the target folder.
 - Deployment target is `deploy`, which currently just deploys to a CDN provided in the `local.json` config file. See `config/local.json.example` for more info.
