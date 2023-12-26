import React from 'react';
import { createComponent } from './utils/create-component.js';

const elementClass = { name: 'Checkbox', _properties: { disabled: '', label: '', checked: '', indeterminate: '' } };

const Checkbox = createComponent({
  react: React,
  elementClass,
  tagName: 'vaadin-checkbox',
  events: {},
  importFunc: () => import('@vaadin/checkbox/vaadin-checkbox.js'),
});

export { Checkbox };
