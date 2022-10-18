import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = document.body.querySelector('main')!;
ReactDOM
  .createRoot(root)
  .render(React.createElement(App));