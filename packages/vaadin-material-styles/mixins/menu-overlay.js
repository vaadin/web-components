/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '../color.js';
import './overlay.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuOverlay = overlay;

registerStyles('', menuOverlay, { moduleId: 'material-menu-overlay' });

export { menuOverlay };
