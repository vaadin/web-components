import React from 'react';
import { Button as ButtonElement } from '@vaadin/button/vaadin-button-component.js';
import { createComponent } from './utils/create-component.js';

const Button = createComponent({ react: React, elementClass: ButtonElement, tagName: 'vaadin-button', events: {} });

export { Button, ButtonElement };
