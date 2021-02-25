# Components monorepo experiment

## Setup

```sh
yarn
```

## Run all tests in Chrome

```sh
yarn test
```

Note: this and following scripts only run tests for packages changed since `origin/master` branch.

## Run all tests in Firefox

```sh
yarn test:firefox
```

## Run all tests in WebKit

```sh
yarn test:webkit
```

## Run tests for single package

```sh
yarn test --group vaadin-upload
```
