/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './version.js';
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * Default values for component-specific custom properties.
 */
const globals = css`
  html {
    --vaadin-checkbox-size: 16px;
    --vaadin-radio-button-size: 16px;
  }
`;

export { globals };
