import React from 'react';
import ReactDOM from 'react-dom/client';
import testUtils from 'react-dom/test-utils';
import { expect } from '@esm-bundle/chai';
import App from './App.js';

const act = testUtils.act;

describe('Kitchen Sink App', () => {
  let container: HTMLElement = document.createElement('main');
  document.body.appendChild(container);
  let root: ReactDOM.Root;

  beforeEach(async () => {
    await act(() => {
      root = ReactDOM.createRoot(container);
    });
  });

  afterEach(async () => {
    await act(() => {
      root.unmount();
    });

    // Clean the container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  });

  it('should render', async () => {
    await act(() => {
      root.render(<App></App>);
    });

    expect(container.firstElementChild).to.not.be.null;
  });
});
