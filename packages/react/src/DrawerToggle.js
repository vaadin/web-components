import React from 'react';
import { DrawerToggle as DrawerToggleElement } from '@vaadin/app-layout/theme/lumo/vaadin-drawer-toggle-plain.js';
import { createComponent } from './utils/create-component.js';

const DrawerToggle = createComponent({
  react: React,
  elementClass: DrawerToggleElement,
  tagName: 'vaadin-drawer-toggle',
  events: {},
});

export { DrawerToggle, DrawerToggleElement };
