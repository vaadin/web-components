import React from 'react';
import { createComponent } from './utils/create-component.js';

const elementClass = { name: 'Button', _properties: { disabled: '' } };

const Button = createComponent({
  react: React,
  elementClass,
  tagName: 'vaadin-button',
  events: {},
  importFunc: () => import('@vaadin/button/vaadin-button.js'),
});

export { Button };
