/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '../color.js';
import './overlay.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const menuOverlay = overlay;

registerStyles('', menuOverlay, { moduleId: 'material-menu-overlay' });

export { menuOverlay };
