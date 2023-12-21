import React from 'react';
import { MenuBar as MenuBarElement } from '@vaadin/menu-bar/theme/lumo/vaadin-menu-bar-plain.js';
import { createComponent } from './utils/create-component.js';

const MenuBar = createComponent({ react: React, elementClass: MenuBarElement, tagName: 'vaadin-menu-bar', events: {} });

export { MenuBar, MenuBarElement };
