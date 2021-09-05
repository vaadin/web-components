/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import { overlay } from '@vaadin/vaadin-material-styles/mixins/overlay.js';
import '../color.js';
import './overlay.js';

const menuOverlay = overlay;

registerStyles('', menuOverlay, { moduleId: 'material-menu-overlay' });

export { menuOverlay };
