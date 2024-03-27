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
import '../color.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { overlay } from './overlay.js';

const menuOverlay = overlay;

registerStyles('', menuOverlay, { moduleId: 'material-menu-overlay' });

export { menuOverlay };
