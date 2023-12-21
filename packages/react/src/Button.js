import React from 'react';
import { Button as ButtonElement } from '@vaadin/button/theme/lumo/vaadin-button-plain.js';
import { createComponent } from './utils/create-component.js';

const Button = createComponent({ react: React, elementClass: ButtonElement, tagName: 'vaadin-button', events: {} });

export { Button, ButtonElement };
