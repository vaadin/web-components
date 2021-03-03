/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '../color.js';
import './overlay.js';

const menuOverlay = css``;

registerStyles('', menuOverlay, { moduleId: 'material-menu-overlay', include: ['material-overlay'] });

export { menuOverlay };
