import React from 'react';
import { createComponent } from './utils/create-component.js';

const elementClass = { name: 'Details', _properties: { disabled: '', opened: '', summary: '' } };

const Details = createComponent({
  react: React,
  elementClass,
  tagName: 'vaadin-details',
  events: {},
  importFunc: () => import('@vaadin/details/vaadin-details.js'),
});

export { Details };
